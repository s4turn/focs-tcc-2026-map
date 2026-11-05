# FOCS × TCC 2026 conference map

A phone-friendly guide to Kimmel Center and Warren Weaver Hall at NYU: expandable isometric floors, room and track locations, food and coffee stops, and an interactive program.

[Open the map](https://cs.nyu.edu/~mmb586/focs-tcc-2026-map/)

## Run locally

No build step or dependencies are required. From this repository, run:

```sh
python3 -m http.server 8765 --directory dist
```

Open <http://localhost:8765/>. Query parameters preserve the selected day, floor, mood and program view.

## Contents

- `dist/app.js` and the map styles render the venue guide.
- `dist/program.js` and `dist/program-data.json` provide the program and session expansion.
- `dist/room-data.json` supplies the reviewed room inventory and its confirmation dates.
- Neighborhood and venue-flight files provide the transition between venues.

The schedule is a reviewed snapshot. Its source-check dates, timing status and unresolved conflicts are retained in the published data. Room holds and refreshment service have separate evidence; a reservation alone does not establish food or coffee service. Floor plans are schematic and not to scale.

## Publish

Copy the contents of `dist/` to the website directory. Keep all files together; paths are relative, so the app works in a subdirectory. No server-side code is required.

This repository contains the public application source and sanitized data snapshots. Internal planning material, authenticated source caches and working notes are excluded.
