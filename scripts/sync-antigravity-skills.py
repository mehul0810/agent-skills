"""Merge this checkout's public skill names into Antigravity's personal manifest."""

import json
import os
from pathlib import Path
import stat
import sys
import tempfile


def unique_keys(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"duplicate JSON key: {key}")
        result[key] = value
    return result


def invalid_constant(value):
    raise ValueError(f"not a JSON number: {value}")


def read_manifest(path):
    try:
        mode = path.lstat().st_mode
    except FileNotFoundError:
        return None, 0o600
    if not stat.S_ISREG(mode):
        raise ValueError(f"not a regular manifest: {path}")
    return path.read_bytes(), stat.S_IMODE(mode)


def replace_manifest(path, original, mode, document):
    path.parent.mkdir(mode=0o700, parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(dir=path.parent, prefix=".skills.json.")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as out:
            json.dump(document, out, ensure_ascii=False, indent=2)
            out.write("\n")
        if original is None:
            os.link(temp, path)  # Do not overwrite a concurrently created file.
        else:
            os.chmod(temp, mode)
            if read_manifest(path) != (original, mode):
                raise ValueError(f"{path} changed during sync; rerun the installer")
            os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def sync(mode, path, public, selected):
    root = Path(__file__).resolve().parent.parent
    original, permissions = read_manifest(path)
    doc = json.loads(original, object_pairs_hook=unique_keys, parse_constant=invalid_constant) if original is not None else {}
    if not isinstance(doc, dict) or not isinstance(doc.get("entries", []), list):
        raise ValueError("expected a manifest object with an optional entries array")
    entries = doc.get("entries", [])
    matches = []
    for entry in entries:
        if not isinstance(entry, dict) or not isinstance(entry.get("path"), str) or not entry["path"]:
            raise ValueError("each manifest entry needs a nonempty path")
        if os.path.realpath(path.parent / entry["path"]) == str(root):
            matches.append(entry)
    if len(matches) > 1:
        raise ValueError("multiple entries for this checkout; reconcile them before syncing")
    if not matches and mode in {"auto", "refresh"}:
        if mode == "refresh":
            print("Antigravity: this checkout is not registered; unchanged")
        return
    if not matches and mode == "check":
        raise ValueError("this checkout is not registered; install with --antigravity")
    if not (root / ".git").exists():
        raise ValueError("Antigravity sync requires a Git checkout to identify public skills")

    entry = matches[0] if matches else {"path": str(root)}
    previous = entry.get("include_only", [])
    if not isinstance(previous, list) or not all(isinstance(n, str) for n in previous):
        raise ValueError("include_only must be an array of skill names")
    if mode == "refresh":
        if "include_only" not in entry:
            raise ValueError("unfiltered entry preserved; cannot verify only public skills are exposed; choose registration or sync deliberately")
        stale = sorted(set(previous) - public)
        if stale:
            raise ValueError(f"stale or nonpublic selected names preserved; review manually: {', '.join(stale)}")
        print(f"Antigravity: existing selection of {len(previous)} skills preserved")
        return
    # A selected install is additive. An existing unfiltered entry already
    # exposed the full pack; narrow it to public names without losing skills.
    existing = public if matches and "include_only" not in entry else public.intersection(previous)
    wanted = sorted(existing.union(selected) if selected else public)
    if matches and entry.get("include_only") == wanted:
        print(f"Antigravity: {len(wanted)} public skills already listed in {path}")
        return
    if mode == "check":
        raise ValueError(f"public skill list is out of sync in {path}; rerun the installer")
    if not matches:
        doc.setdefault("entries", []).append(entry)
    entry["include_only"] = wanted
    replace_manifest(path, original, permissions, doc)
    print(f"Antigravity: listed {len(wanted)} public skills in {path}")


if __name__ == "__main__":
    action, manifest, *names = sys.argv[1:]
    try:
        public_names = set(sys.stdin.read().splitlines())
        if action not in {"auto", "sync", "check", "refresh"} or not public_names or not set(names) <= public_names:
            raise ValueError("invalid sync mode or public skill selection")
        sync(action, Path(manifest), public_names, names)
    except (ValueError, OSError) as error:
        sys.exit(f"Antigravity: {error}")
