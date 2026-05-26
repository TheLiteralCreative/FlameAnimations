# Changelog

All notable changes to FlameAnimations will be documented in this file.

Format follows Keep a Changelog and versions follow SemVer.

## [0.1.0] - Unreleased

### Added
- Project bootstrap: Vite + React + TypeScript scaffold.
- SPEC, ADRs (0001–0005), ROADMAP, CHANGELOG, issue templates.
- Drawing engine on HTML Canvas with Pointer Events (touch, Apple Pencil, mouse, trackpad).
- Apple Pencil pressure sensitivity (toggleable).
- 16-color palette with custom color picker.
- Round and square brushes, size slider (1–80 px).
- Eraser using `destination-out` (preserves background, undoable).
- Undo / redo with capped 50-snapshot history (ImageBitmap-backed).
- Clear canvas with confirmation dialog.
- PNG export with `flameanimations-YYYYMMDD-HHMMSS.png` filename.
- Local IndexedDB gallery: save, load, delete, thumbnails, empty/error states.
- Welcome / help modal with keyboard shortcuts.
- Keyboard shortcuts: B/E mode, [ ] size, ⌘Z / ⌘⇧Z undo/redo, S save, D download.
- Toast notifications for save / export / errors.
- PWA manifest with flame icon for iPad home-screen install.
- Responsive layout for iPad portrait/landscape and laptop.
- Dark mode via `prefers-color-scheme`.
