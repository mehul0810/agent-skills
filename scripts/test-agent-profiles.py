"""Reject malformed templates under normal and optimized Python execution."""
import importlib.util
from pathlib import Path
import shutil
import tempfile
import unittest
import sys

sys.dont_write_bytecode = True

spec = importlib.util.spec_from_file_location('profiles', Path(__file__).with_name('validate-agent-profiles.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
SOURCE = Path(__file__).resolve().parents[1] / 'templates/project-agents'


class ProfilesTest(unittest.TestCase):
    def test_valid(self):
        module.validate(SOURCE)

    def test_rejections(self):
        mutations = [
            lambda s: s + '\nmodel = "transient-model"\n',
            lambda s: s.replace('sandbox_mode = "read-only"', 'sandbox_mode = "danger-full-access"'),
            lambda s: s.replace('Do not subdelegate', 'Delegate freely'),
            lambda s: s.replace('low/light', 'unlimited'),
            lambda s: 'name = [',
        ]
        for mutate in mutations:
            with self.subTest(mutation=mutate), tempfile.TemporaryDirectory() as temp:
                target = Path(temp) / 'agents'
                shutil.copytree(SOURCE, target)
                file = target / 'wp-reviewer.toml'
                file.write_text(mutate(file.read_text()))
                with self.assertRaises(ValueError):
                    module.validate(target)
        with tempfile.TemporaryDirectory() as temp:
            with self.assertRaises(ValueError):
                module.validate(Path(temp))


if __name__ == '__main__':
    unittest.main()
