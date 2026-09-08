"""Validate portable agent templates without executing or installing them."""
from pathlib import Path
import tomllib

EXPECTED = {
    'wp-planner': 'read-only',
    'wp-implementer': 'workspace-write',
    'wp-reviewer': 'read-only',
    'wp-behavior-validator': 'workspace-write',
    'wp-release-readiness': 'read-only',
}


def validate(directory):
    files = list(directory.glob('*.toml'))
    if {p.stem for p in files} != set(EXPECTED):
        raise ValueError('Unexpected/missing profiles')
    for path in files:
        data = tomllib.loads(path.read_text())
        if set(data) != {'name', 'description', 'sandbox_mode', 'developer_instructions'}:
            raise ValueError(f'{path.name}: unexpected fields, model pin or permission override')
        if data['name'] != path.stem or data['sandbox_mode'] != EXPECTED[path.stem]:
            raise ValueError(f'{path.name}: identity or sandbox mismatch')
        for field in ('description', 'developer_instructions'):
            if not isinstance(data[field], str) or not data[field].strip():
                raise ValueError(f'{path.name}: empty or invalid {field}')
        instructions = data['developer_instructions']
        if len(instructions.split()) > 250:
            raise ValueError(f'{path.name}: instruction budget exceeded')
        if 'Do not subdelegate' not in instructions or 'low/light' not in instructions:
            raise ValueError(f'{path.name}: missing delegation or reasoning boundary')


if __name__ == '__main__':
    try:
        validate(Path(__file__).resolve().parents[1] / 'templates/project-agents')
    except (ValueError, OSError) as error:
        raise SystemExit(f'FAIL: {error}') from error
    print('PASS: five portable agent profiles; no model pins or permission overrides')
