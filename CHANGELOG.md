# Changelog

All notable changes to FlameAnimations will be documented in this file.

Format follows Keep a Changelog and versions follow SemVer.

## [0.2.1] - 2026-05-26

### Fixed
- **Crash on long sessions** — useHistory returned a fresh object every render, and an App-level effect depending on it called `history.reset()` on every change. That created an ImageBitmap-leaking infinite render loop that crashed the tab (especially iPad). Replaced with per-frame undo stacks keyed by frame id, all returned via `useMemo`.
- **Pointer listener thrashing** — Canvas re-bound its pointer event listeners on every App render because the `anim` object was unstable. Now destructured to stable callbacks; listeners bind once.
- **Cross-frame undo data loss** — undoing on Frame 2 restored Frame 1's bitmap to the canvas while currentIndex stayed at 2; next commit overwrote Frame 2 with Frame 1's content. Per-frame stacks fix this.
- **All-grey canvas (no drawable surface)** — the M5 canvas-stack wrapper had no in-flow children (all canvases were `position: absolute`), so it collapsed to 0×0. ResizeObserver on `.canvas-frame` now imperatively sizes the stack to the largest 8:5 box that fits, in a `useLayoutEffect` before paint.
- IndexedDB persist debounce raised from 600ms to 1500ms to reduce write pressure on iPad for big animations.
- StrictMode-safe initial animation load (gated by `loadedRef`) prevents double-creating the initial blank frame in dev.

### Changed
- Undo/redo is now per-frame. Drawing on frame 1, switching to frame 2, then pressing undo only reverts frame 2; coming back to frame 1, your frame 1 history is preserved.

## [0.2.0] - 2026-05-25

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

## [0.1.0] - 2026-05-25 — Initial MVP

Released and deployed to https://flameanimations.com via Render Static Site.

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
