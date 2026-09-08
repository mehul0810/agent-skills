"""Validate portable agent templates without executing or installing them."""
from pathlib import Path
import tomllib

root = Path(__file__).resolve().parents[1]
expected = {
    'wp-planner': 'read-only',
    'wp-implementer': 'workspace-write',
    'wp-reviewer': 'read-only',
    'wp-behavior-validator': 'workspace-write',
    'wp-release-readiness': 'read-only',
}
files = list((root / 'templates/project-agents').glob('*.toml'))
assert {p.stem for p in files} == set(expected), 'Unexpected/missing profiles'
for path in files:
    data = tomllib.loads(path.read_text())
    assert set(data) == {'name', 'description', 'sandbox_mode', 'developer_instructions'}, path
    assert data['name'] == path.stem and data['sandbox_mode'] == expected[path.stem], path
    assert data['description'].strip() and data['developer_instructions'].strip(), path
    assert len(data['developer_instructions'].split()) <= 250, path
    assert 'Do not subdelegate' in data['developer_instructions'], path
    assert 'low/light' in data['developer_instructions'], path
print('PASS: five portable agent profiles; no model pins or permission overrides')
