import { useEffect } from 'react'
import { Icon } from './Icon'

interface Props {
  open: boolean
  onClose: () => void
}

export function HelpModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header help-hero">
          <button
            type="button"
            className="icon-btn modal-close"
            aria-label="Close help"
            onClick={onClose}
          >
            <Icon name="x" />
          </button>
          <h1 id="help-title" className="hero-title">
            <Icon name="flame" size={40} />
            <span>FLAME ANIMATIONS</span>
            <Icon name="flame" size={40} />
          </h1>
        </div>
        <div className="help-body">
          <p>Draw with a finger, an Apple Pencil, a trackpad, or a mouse.</p>
          <ul>
            <li>
              <strong>Pick a color</strong> from the palette, or tap{' '}
              <kbd>+</kbd> for any color you like.
            </li>
            <li>
              <strong>Change brush size</strong> with the slider, and choose a
              round or square brush.
            </li>
            <li>
              <strong>Eraser</strong> removes only what you drew on top — your
              background stays clean.
            </li>
            <li>
              <strong>Undo</strong> and <strong>Redo</strong> let you go back
              and forward through your strokes.
            </li>
          </ul>
          <h3 className="help-section-title">Make an animation</h3>
          <ul>
            <li>
              Draw a picture, then tap <strong>▶▶</strong> to add a new
              frame.
            </li>
            <li>
              Tap <strong>▶</strong> to play your animation in a loop. Tap{' '}
              again to stop.
            </li>
            <li>
              Tap the <strong>onion icon</strong> (top right of the canvas)
              to see the previous frame faintly underneath — perfect for
              animating.
            </li>
            <li>
              <strong>Export GIF</strong> turns all your frames into a
              shareable GIF.
            </li>
            <li>
              <strong>New</strong> starts a brand-new animation (your old
              one will be deleted — export it first!).
            </li>
          </ul>
          <details>
            <summary>Keyboard shortcuts (laptop)</summary>
            <ul className="shortcuts">
              <li>
                <kbd>B</kbd> brush · <kbd>E</kbd> eraser
              </li>
              <li>
                <kbd>[</kbd> smaller · <kbd>]</kbd> bigger
              </li>
              <li>
                <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Z</kbd> undo ·{' '}
                <kbd>⇧</kbd>+<kbd>⌘</kbd>/<kbd>Ctrl</kbd>+<kbd>Z</kbd> redo
              </li>
              <li>
                <kbd>←</kbd> previous frame · <kbd>→</kbd> next frame ·{' '}
                <kbd>Space</kbd> play/stop
              </li>
              <li>
                <kbd>O</kbd> toggle onion skin
              </li>
              <li>
                <kbd>S</kbd> save frame · <kbd>D</kbd> download PNG
              </li>
            </ul>
          </details>

          <div className="hero-closer">
            <p>
              Emmett,
              <br />
              <strong>FLAME ANIMATIONS</strong> belongs to <strong>YOU</strong>…
              <br />
              It can be <strong>WHATEVER YOU WANT IT TO BE</strong>.
              <br />
              If you can dream it and explain it, you can build it.
              <br />
              The only limit is <strong>YOUR IMAGINATION</strong>.
            </p>
            <p className="hero-closer-signoff">— Love, DAD</p>
          </div>
        </div>
      </div>
    </div>
  )
}
