# FlameAnimations

A simple, local-first browser drawing app — a digital art kit that grows with the artist.

Runs from an always-on iMac on the home LAN. Usable from an iPad or laptop browser. No accounts. No cloud. No tracking.

## Quickstart

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## LAN Hosting (iMac → iPad/laptop)

Build once, then preview with `--host` so other devices on your network can reach it:

```bash
npm run build
npm run preview -- --host 0.0.0.0
```

Open `http://<imac-hostname>.local:4173` (or the iMac's LAN IP) from the iPad or laptop browser.

Use `npm run dev -- --host` if you want hot-reload over LAN during development.

## Project Structure

| Path | Purpose |
|---|---|
| `src/` | React + TypeScript source |
| `public/` | Static assets served as-is |
| `docs/spec/SPEC.md` | Product and engineering spec |
| `docs/adr/` | Architecture Decision Records |
| `docs/diagrams/` | Mermaid C4 diagrams |
| `ROADMAP.md` | Milestones and gates |
| `CHANGELOG.md` | Release notes (Keep-a-Changelog) |
| `.github/ISSUE_TEMPLATE/` | Implementation issue templates |

## Documentation

- [SPEC](docs/spec/SPEC.md) — what we're building and why
- [ROADMAP](ROADMAP.md) — milestones M0 → M4 and beyond
- [ADRs](docs/adr/) — architecture decisions

## Status

Pre-MVP. See [ROADMAP.md](ROADMAP.md) for current milestone.
