# Changelog

All notable changes to FlameAnimations will be documented in this file.

Format follows Keep a Changelog and versions follow SemVer.

## [0.2.0] - Unreleased

### Added
- **Frame-based animation:** up to 500 frames per animation, persisted across reloads in IndexedDB.
- **Frame deck:** ◀◀ prev · ▶/■ play-stop · ▶▶ next, with frame counter, "New Animation", and "Export GIF" buttons.
- **Filmstrip** below canvas: scrollable thumbnails, click any thumb to jump to that frame; auto-scrolls to current.
- **Onion skin overlay:** top-right of canvas, toggleable + opacity slider 10–90%. Renders previous frame faintly underneath the current.
- **GIF export** via `gifenc` (24 fps, 640px max dim). Filename: `flameanimations-anim-YYYYMMDD-HHMMSS.gif`.
- **Playback loop** at 24 fps using requestAnimationFrame.
- Keyboard shortcuts: `←`/`→` prev/next frame, `Space` play/stop, `O` toggle onion skin.
- "New Animation" confirm dialog warns about deleting frames before exporting.
- Save button now reads "Save Frame" — saves current frame to the single-image gallery.

### Changed
- Drawing canvas is now transparent; white background is rendered separately so onion-skin and GIF export composite correctly.
- `engine.toBlob()` split into `toFrameBlob()` (transparent strokes only, for frame storage) and `toExportBlob()` (composited on white, for PNG save/download).
- Clear button now clears the **current frame only** (other frames stay safe).
- IndexedDB upgraded to v2 with new `animations` object store.

## [0.1.0] - 2026-05-25

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
