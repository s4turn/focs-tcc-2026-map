#!/usr/bin/env python3
"""Reject non-runtime data before exporting or pushing the public app."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_PATHS = {'.github/workflows/pages.yml', '.gitignore', 'README.md', 'redirect.html', 'scripts/check-public-data.py'}
PUBLIC_PATHS.update('dist/' + name for name in 'app.js index.html map.css moods.js neighborhood.css neighborhood.js program-data.json program.css program.js room-data.json style.css venue-flight.css venue-flight.js'.split())
PUBLIC_PATHS.update('dist/assets/sponsors/' + name for name in 'focs-aws.webp focs-cognition.webp focs-google.webp focs-jane-street.webp tcc-aws.svg tcc-category-labs.svg tcc-google.svg tcc-ntt-research.jpg tcc-stellar.png tcc-tinfoil.svg'.split())
SCHEMAS = {
    'program': set('schemaVersion timezone generatedAt sources reviewHolds days'.split()),
    'source': {'id', 'url'},
    'day': set('id date title venueId sessions'.split()),
    'session': set('id conference kind track title theme start end room floor venueId chair url papers relatedLinks timingConflict'.split()),
    'paper': set('id title authors order start end abstract publicPaperUrl url'.split()),
    'link': {'label', 'url'},
    'conflict': {'note'},
    'inventory': {'source', 'rooms'},
    'room': set('venueId date floor roomId room role purpose'.split()),
}

def check_keys(value, schema, path):
    if not isinstance(value, dict) or set(value) - SCHEMAS[schema]:
        raise ValueError(f'Unexpected fields at {path}')

def validate(program, inventory):
    check_keys(program, 'program', 'program')
    for source in program.get('sources', []):
        check_keys(source, 'source', 'program.sources')
        if source.get('id') not in {'focs-public', 'tcc-public'}:
            raise ValueError('Unrecognized public source')
    if any(item != {} for item in program.get('reviewHolds', [])):
        raise ValueError('Review records must stay in the maintenance workspace')
    for day in program['days']:
        check_keys(day, 'day', 'program.days')
        for session in day['sessions']:
            check_keys(session, 'session', 'program.days.sessions')
            for paper in session.get('papers', []):
                check_keys(paper, 'paper', 'program.days.sessions.papers')
            for link in session.get('relatedLinks', []):
                check_keys(link, 'link', 'program.days.sessions.relatedLinks')
            if 'timingConflict' in session:
                check_keys(session['timingConflict'], 'conflict', 'program.days.sessions.timingConflict')
    check_keys(inventory, 'inventory', 'inventory')
    if inventory.get('source', {}) != {}:
        raise ValueError('Inventory source records must stay in the maintenance workspace')
    for room in inventory['rooms']:
        check_keys(room, 'room', 'inventory.rooms')
        if 'purpose' in room and room['purpose'] != 'break':
            raise ValueError('Inventory purpose must be a display category')

def check(revision=None):
    args = ['ls-tree', '-r', '--name-only', revision] if revision else ['ls-files']
    paths = set(subprocess.check_output(['git', '-C', str(ROOT), *args], text=True).splitlines())
    if paths - PUBLIC_PATHS:
        raise ValueError('Unexpected public repository paths; review the export before committing')
    def read(name):
        if revision:
            return json.loads(subprocess.check_output(['git', '-C', str(ROOT), 'show', f'{revision}:dist/{name}']))
        return json.loads((ROOT / 'dist' / name).read_text())
    validate(read('program-data.json'), read('room-data.json'))

if __name__ == '__main__':
    try:
        for revision in sys.argv[1:] or [None]:
            check(revision)
    except (ValueError, KeyError, subprocess.CalledProcessError) as error:
        sys.exit(str(error))
    print('PASS: public snapshot field boundaries')
