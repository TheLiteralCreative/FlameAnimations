# ROADMAP — FlameAnimations Drawing App

Path: `ROADMAP.md`

## M0 — Project Bootstrap
- [x] Create Vite React TypeScript app.
- [ ] Add linting, formatting, and basic test runner.
- [x] Add app shell with responsive layout.
- [x] Add `CHANGELOG.md`.
- [x] Add README with local iMac hosting instructions.

Acceptance:
- App runs locally with `npm run dev`.
- App opens from another LAN device using host mode.
- Repo structure matches SPEC repo setup.  
See SPEC §5, §13; ADR-0001, ADR-0004.

## M1 — Core Drawing MVP
- [x] Implement canvas drawing with Pointer Events.
- [x] Add color picker and starter palette.
- [x] Add brush size control.
- [x] Add round and square brush shapes.
- [x] Add eraser.
- [x] Prevent page scroll while drawing on touch devices.

Acceptance:
- Artist can draw smoothly on iPad and laptop.
- Brush color, size, shape, and eraser all work.
- Manual smoke test passes on target devices.  
See SPEC §3, §5, §10, §11; ADR-0001.

## M2 — History, Export, and Safety
- [x] Add undo/redo.
- [x] Add clear canvas with confirmation.
- [x] Add PNG export using `canvas.toBlob`.
- [x] Add filename convention.
- [x] Cap undo stack to protect memory.

Acceptance:
- Undo and redo pass Gherkin UC-4.
- PNG export creates usable image files on iPad/laptop.
- Clear action cannot happen without confirmation.  
See SPEC §3, §9, §14; ADR-0002.

## M3 — Local Gallery
- [x] Add IndexedDB wrapper.
- [x] Save artwork with thumbnail and full PNG blob.
- [x] Add gallery list/grid.
- [x] Add load and delete actions.
- [x] Add empty/error states.

Acceptance:
- Save → reload page → reopen artwork works on same device/browser.
- Delete removes selected local artwork only.
- Gallery failure produces user-readable error.  
See SPEC §3, §5, §9, §10; ADR-0002, ADR-0005.

## M4 — Polish and V1 Candidates
- [ ] Add camera/photo import if browser support is adequate.
- [ ] Add canvas size presets.
- [ ] Add custom brush presets.
- [x] Add keyboard shortcuts.
- [x] Add PWA manifest and app icons.
- [x] Add simple help overlay.

## M5 — Frame-Based Animation
- [x] Refactor engine for transparent strokes + separate background.
- [x] Up to 500-frame animations, persisted in IndexedDB.
- [x] Frame deck (prev/play/next, counter, new, export).
- [x] Filmstrip with click-to-jump.
- [x] Onion-skin overlay with opacity slider.
- [x] 24 fps playback loop.
- [x] GIF export via gifenc.
- [x] Keyboard shortcuts (arrows, space, O).

Acceptance:
- Camera/photo import either works on target browsers or is clearly deferred.
- App can be launched comfortably from iPad home screen if PWA is enabled.
- V1 features do not compromise MVP simplicity.  
See SPEC §5, §7, §10; ADR-0003, ADR-0004.

## Future
- [ ] Layers.
- [ ] Stamps.
- [ ] Shape tools.
- [ ] Text tool.
- [ ] Flipbook/animation mode.
- [ ] Optional iMac-hosted shared gallery with backend API.
