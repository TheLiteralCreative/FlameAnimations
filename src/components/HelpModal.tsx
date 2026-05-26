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
          <div className="help-hero-text">
            <p className="hero-welcome">
              Welcome to your very own website Emmett!
            </p>
            <h1 id="help-title" className="hero-title">
              <Icon name="flame" size={32} />
              <span>FLAME ANIMATIONS</span>
            </h1>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close help"
            onClick={onClose}
          >
            <Icon name="x" />
          </button>
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
            <li>
              <strong>Save to Gallery</strong> keeps your art on this device.
              <strong> Export PNG</strong> downloads a file you can share.
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
                <kbd>S</kbd> save · <kbd>D</kbd> download PNG
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
