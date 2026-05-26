import { useState } from 'react'
import { Icon } from './Icon'
import type { SavedArtworkSummary } from '../types'

interface Props {
  open: boolean
  items: SavedArtworkSummary[]
  loading: boolean
  error: string | null
  onClose: () => void
  onOpenArtwork: (id: string) => void
  onDeleteArtwork: (id: string) => void
}

export function Gallery({
  open,
  items,
  loading,
  error,
  onClose,
  onOpenArtwork,
  onDeleteArtwork,
}: Props) {
  const [confirmingId, setConfirmingId] = useState<string | null>(null)

  if (!open) return null

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal modal-wide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gallery-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="gallery-title">Your Gallery</h2>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close gallery"
            onClick={onClose}
          >
            <Icon name="x" />
          </button>
        </div>

        {error ? (
          <p className="gallery-error">{error}</p>
        ) : loading ? (
          <p className="gallery-empty">Loading…</p>
        ) : items.length === 0 ? (
          <div className="gallery-empty">
            <p>No artwork saved yet.</p>
            <p>
              Draw something, then tap <strong>Save to Gallery</strong> to keep
              it on this device.
            </p>
          </div>
        ) : (
          <ul className="gallery-grid">
            {items.map((it) => {
              const isConfirming = confirmingId === it.id
              return (
                <li key={it.id} className="gallery-item">
                  <button
                    type="button"
                    className="thumb-btn"
                    onClick={() => onOpenArtwork(it.id)}
                    aria-label={`Open ${it.title}`}
                  >
                    <img src={it.thumbnail} alt="" />
                  </button>
                  <div className="gallery-meta">
                    <span className="gallery-title" title={it.title}>
                      {it.title}
                    </span>
                    {isConfirming ? (
                      <div className="confirm-inline">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            onDeleteArtwork(it.id)
                            setConfirmingId(null)
                          }}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm"
                          onClick={() => setConfirmingId(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="icon-btn small"
                        aria-label={`Delete ${it.title}`}
                        onClick={() => setConfirmingId(it.id)}
                      >
                        <Icon name="trash" size={18} />
                      </button>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
