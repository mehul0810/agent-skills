#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { digestScenarioContract } from "./behavior-evidence-audit.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "scenario-contract-"));
const scenario = { id: "selected", files: ["cases.md"], anchors: ["Selected Case"], fixtureFiles: ["fixture.bin"] };
const original = "# Scenarios\n\n## Selected Case\n\nPrompt: initial.\n\n### Nested requirement\n\nRequired: preserve identity.\n\n```md\n## Not a boundary\n```\n\nForbidden: invented proof.\n\n## Other Case\n\nUnrelated.\n";
const write = (name, bytes) => fs.writeFileSync(path.join(root, name), bytes);
const evaluate = (value = scenario, revision) => {
  const errors = [];
  const hash = digestScenarioContract(root, value, errors, revision);
  return { hash, errors };
};
const hash = (value = scenario, revision) => {
  const result = evaluate(value, revision);
  assert.deepEqual(result.errors, []);
  return result.hash;
};
let assertions = 0;
const check = (label, callback) => {
  try { callback(); assertions++; } catch (error) { error.message = `${label}: ${error.message}`; throw error; }
};

try {
  write("cases.md", original);
  write("fixture.bin", Buffer.from([0, 255, 10]));
  const originalHash = hash();
  for (const token of ["Prompt: initial.", "Required: preserve identity.", "Forbidden: invented proof."]) {
    check(`body change ${token}`, () => {
      write("cases.md", original.replace(token, `${token} Changed.`));
      assert.notEqual(hash(), originalHash);
    });
  }
  check("unrelated heading section", () => {
    write("cases.md", original.replace("Unrelated.", "Unrelated changed."));
    assert.equal(hash(), originalHash);
  });
  check("selected line endings are byte-bound", () => {
    write("cases.md", original.replaceAll("\n", "\r\n"));
    assert.notEqual(hash(), originalHash);
  });
  write("cases.md", original);
  check("binary fixture mutation", () => {
    write("fixture.bin", Buffer.from([0, 254, 10]));
    assert.notEqual(hash(), originalHash);
    write("fixture.bin", Buffer.from([0, 255, 10]));
  });
  check("explicit empty fixture declaration", () => {
    assert.equal(evaluate({ ...scenario, fixtureFiles: [] }).errors.length, 0);
    assert.ok(evaluate({ ...scenario, fixtureFiles: undefined }).errors.length);
  });
  check("missing fixture", () => assert.ok(evaluate({ ...scenario, fixtureFiles: ["absent.bin"] }).errors.length));
  check("missing scenario source", () => assert.ok(evaluate({ ...scenario, files: ["absent.md"] }).errors.length));
  check("missing anchor", () => assert.ok(evaluate({ ...scenario, anchors: ["Absent"] }).errors.length));
  check("duplicate anchor in one line", () => {
    write("cases.md", original.replace("Selected Case", "Selected Case Selected Case"));
    assert.ok(evaluate().errors.length);
  });
  check("duplicate anchor across files", () => {
    write("cases.md", original);
    write("copy.md", original);
    assert.ok(evaluate({ ...scenario, files: ["cases.md", "copy.md"] }).errors.length);
  });
  for (const field of ["files", "fixtureFiles"]) {
    for (const unsafe of ["../escape", "/etc/passwd", "dir/../../escape", "dir\\escape", "./cases.md", "dir//file", "bad\0file", ".git/config"]) {
      check(`reject ${field} path ${JSON.stringify(unsafe)}`, () => assert.ok(evaluate({ ...scenario, [field]: [unsafe] }).errors.length));
    }
    check(`reject duplicate ${field}`, () => assert.ok(evaluate({ ...scenario, [field]: ["cases.md", "cases.md"] }).errors.length));
  }
  check("regular-file requirement", () => {
    fs.mkdirSync(path.join(root, "directory"));
    assert.ok(evaluate({ ...scenario, fixtureFiles: ["directory"] }).errors.length);
  });
  check("symlink file", () => {
    fs.symlinkSync("fixture.bin", path.join(root, "linked.bin"));
    assert.ok(evaluate({ ...scenario, fixtureFiles: ["linked.bin"] }).errors.length);
  });
  check("symlink parent", () => {
    fs.symlinkSync(root, path.join(root, "linked-directory"));
    assert.ok(evaluate({ ...scenario, files: ["linked-directory/cases.md"] }).errors.length);
  });

  const table = "| Case | Prompt | Expected |\n| --- | --- | --- |\n| Selected Case | Prompt text | Must reject |\n| Other | Unrelated | Pass |\n";
  check("table row isolation and complete criteria", () => {
    write("cases.md", table);
    const before = hash();
    write("cases.md", table.replace("Must reject", "May accept"));
    assert.notEqual(hash(), before);
    write("cases.md", table.replace("Unrelated", "Updated unrelated"));
    assert.equal(hash(), before);
  });
  const paragraph = "# Cases\n\nSelected Case has a prompt\nand a continuation with expected behavior.\n\nAnother independent paragraph.\n";
  check("inline paragraph continuation and isolation", () => {
    write("cases.md", paragraph);
    const before = hash();
    write("cases.md", paragraph.replace("expected behavior", "changed behavior"));
    assert.notEqual(hash(), before);
    write("cases.md", paragraph.replace("Another independent", "Changed independent"));
    assert.equal(hash(), before);
  });
  const items = "# Cases\n\n- Selected Case has a prompt\n  and indented criteria.\n- Another case.\n";
  check("list item continuation and isolation", () => {
    write("cases.md", items);
    const before = hash();
    write("cases.md", items.replace("indented criteria", "changed criteria"));
    assert.notEqual(hash(), before);
    write("cases.md", items.replace("Another case", "Another changed case"));
    assert.equal(hash(), before);
  });
  write("cases.md", original);
  execFileSync("git", ["init", "-q"], { cwd: root });
  execFileSync("git", ["add", "cases.md", "fixture.bin", "linked.bin"], { cwd: root });
  execFileSync("git", ["-c", "user.name=Audit", "-c", "user.email=audit@example.test", "commit", "-qm", "fixture"], { cwd: root });
  const revision = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
  check("historical contract identity survives working-tree changes", () => {
    assert.equal(hash(scenario, revision), originalHash);
    write("cases.md", original.replace("initial.", "changed."));
    write("fixture.bin", Buffer.from([0, 254, 10]));
    assert.equal(hash(scenario, revision), originalHash);
    assert.notEqual(hash(), originalHash);
  });
  check("historical symlink rejection", () => assert.ok(evaluate({ ...scenario, fixtureFiles: ["linked.bin"] }, revision).errors.length));
  check("fixture absent at tested revision", () => assert.ok(evaluate({ ...scenario, fixtureFiles: ["copy.md"] }, revision).errors.length));
  check("invalid historical revision", () => assert.ok(evaluate(scenario, "HEAD").errors.length));
  check("large binary fixture hashes equally from disk and commit", () => {
    write("large.bin", Buffer.alloc(1100000, 93));
    execFileSync("git", ["add", "large.bin"], { cwd: root });
    execFileSync("git", ["-c", "user.name=Audit", "-c", "user.email=audit@example.test", "commit", "-qm", "large fixture"], { cwd: root });
    const rev = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
    write("cases.md", original);
    const value = { ...scenario, fixtureFiles: ["large.bin"] };
    assert.equal(hash(value), hash(value, rev));
  });
  check("oversized binary fixture rejected equally", () => {
    write("large.bin", Buffer.alloc(32 * 1024 * 1024 + 1));
    execFileSync("git", ["add", "large.bin"], { cwd: root });
    execFileSync("git", ["-c", "user.name=Audit", "-c", "user.email=audit@example.test", "commit", "-qm", "oversized fixture"], { cwd: root });
    const rev = execFileSync("git", ["rev-parse", "HEAD"], { cwd: root, encoding: "utf8" }).trim();
    const value = { ...scenario, fixtureFiles: ["large.bin"] };
    assert.ok(evaluate(value).errors.length);
    assert.ok(evaluate(value, rev).errors.length);
  });
  console.log(`scenario contract tests passed (${assertions} cases)`);
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
