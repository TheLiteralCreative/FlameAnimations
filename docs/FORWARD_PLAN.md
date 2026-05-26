# FlameAnimations — Forward Plan

**Last updated:** 2026-05-26
**Current version:** 0.2.1 (M5 hardened — crash + layout fixes)
**Live at:** https://flameanimations.com

This is a personal project for Emmett (12yo). The plan is intentionally
iterative — Emmett and Dad will use the app and return with feature
ideas. Bias toward small, observable, kid-driven changes over big
specs.

Ownership tags:
- `[CLAUDE]` — work I can do without input
- `[YOU]` — needs a decision from Dad or input from Emmett
- `[TOGETHER]` — collaborative; needs both

---

## ✅ Done

- ✓ 2026-05-25 — M0 bootstrap (Vite + React + TS scaffold, SPEC, ADRs, ROADMAP)
- ✓ 2026-05-25 — M1 core drawing (canvas, palette, brushes, eraser, Pointer Events, Pencil pressure)
- ✓ 2026-05-25 — M2 history (undo/redo, clear with confirm, PNG export with filename convention)
- ✓ 2026-05-25 — M3 IndexedDB gallery (save, load, delete, thumbnails, empty/error states)
- ✓ 2026-05-25 — M4 partial: keyboard shortcuts, PWA manifest, help modal
- ✓ 2026-05-25 — Render Static Site deployed + custom domain flameanimations.com (Let's Encrypt via Google Trust)
- ✓ 2026-05-25 — Personalized welcome modal (FLAME ANIMATIONS hero, Dad's note)
- ✓ 2026-05-25 — M5 animation: frame model, frame deck, filmstrip, onion skin, 24fps playback, GIF export, 500-frame IndexedDB persistence
- ✓ 2026-05-26 — M5 crash fixes: per-frame undo stacks (Map keyed by frameId), memoized hook returns, stable callback chain, IDB debounce 600→1500ms, StrictMode-safe init
- ✓ 2026-05-26 — M5 layout fix: ResizeObserver-driven canvas sizing (zero-sized canvas was hiding the drawable surface and onion controls)

---

## Up next (priority order)

### After Emmett's first real session — gather feedback [TOGETHER]
**Before adding more code, watch Emmett use it.** What confuses him?
What does he ask for? Animation tools live or die on touch feel and
discoverability — only real use will surface what to build next.

### Likely M5 polish based on first use [CLAUDE]
- "Duplicate frame" button (great for animation — copy then tweak)
- "Delete frame" button on the filmstrip thumbs
- Drag-to-reorder frames in the filmstrip
- GIF export progress indicator (long animations stall the UI for a few seconds)
- Frame deletion should also drop that frame's undo history (memory hygiene)

### M4 leftovers (deferred, decide if still wanted) [TOGETHER]
- Camera/photo import (`<input type="file" accept="image/*" capture>`) — could be great for tracing photos
- Canvas size presets (square 1:1, portrait 9:16) — Emmett might want different shapes
- Custom brush presets

### M6 stretch ideas [TOGETHER]
- **Layers** — single-layer is fine for now, but layers unlock real animation work
- **Stamps / pre-made shapes** — circle, star, speech bubble
- **Color picker eyedropper** — sample any color from the canvas
- **Animation gallery** — currently one animation; could save multiple
- **Webm/MP4 export** alongside GIF — bigger but smoother
- **Tween / interpolate between two keyframes** — auto-fill frames

### Operational [CLAUDE]
- Add a service-worker / offline mode (PWA isn't fully offline yet — requires sw.js + caching)
- Bundle is 75 KB gzipped — room to grow but worth keeping an eye on
- No tests yet; add Vitest + a few unit tests for `drawingEngine`, `idb`, `exportGif`

---

## Things we decided NOT to do (and why)

- **No backend / cloud sync** — local-first, no accounts, no privacy concerns for a minor's art (ADR-0003)
- **No third-party analytics / telemetry** — privacy by default (ADR-0005)
- **No layers in MVP** — keeps the data model and UI simple for a kid; defer until needed
- **GIF only, not MP4** — universal sharing wins over format quality; FFmpeg.wasm is overkill (30 MB bundle hit)
- **Single animation in IndexedDB, not many** — Emmett can export GIF to save off old animations; reduces cognitive load
