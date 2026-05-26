import { Icon } from './Icon'

interface Props {
  currentIndex: number
  totalFrames: number
  playing: boolean
  onPrev: () => void
  onNext: () => void
  onTogglePlay: () => void
  onNewAnimation: () => void
  onExportGif: () => void
  exporting: boolean
  maxFrames: number
}

export function FrameDeck({
  currentIndex,
  totalFrames,
  playing,
  onPrev,
  onNext,
  onTogglePlay,
  onNewAnimation,
  onExportGif,
  exporting,
  maxFrames,
}: Props) {
  const atStart = currentIndex <= 0
  const atCap = totalFrames >= maxFrames && currentIndex === totalFrames - 1
  const canPlay = totalFrames > 1

  return (
    <div className="frame-deck" role="group" aria-label="Animation frame controls">
      <div className="frame-deck-nav">
        <button
          type="button"
          className="frame-btn"
          aria-label="Previous frame"
          onClick={onPrev}
          disabled={atStart || playing}
          title="Previous frame"
        >
          <Icon name="stepBack" size={22} />
        </button>

        <button
          type="button"
          className={`frame-btn play-btn${playing ? ' playing' : ''}`}
          aria-label={playing ? 'Stop' : 'Play animation'}
          aria-pressed={playing}
          onClick={onTogglePlay}
          disabled={!canPlay}
          title={playing ? 'Stop' : `Play (${totalFrames} frames)`}
        >
          <Icon name={playing ? 'stop' : 'play'} size={22} />
        </button>

        <button
          type="button"
          className="frame-btn"
          aria-label={atCap ? 'Frame limit reached' : 'Next frame (or add new)'}
          onClick={onNext}
          disabled={atCap || playing}
          title={
            atCap
              ? `Maximum ${maxFrames} frames`
              : currentIndex >= totalFrames - 1
              ? 'Add new frame'
              : 'Next frame'
          }
        >
          <Icon name="stepForward" size={22} />
        </button>

        <span className="frame-counter" aria-live="polite">
          <span className="frame-num">{currentIndex + 1}</span>
          <span className="frame-sep"> / </span>
          <span className="frame-total">{totalFrames}</span>
        </span>
      </div>

      <div className="frame-deck-actions">
        <button
          type="button"
          className="btn"
          onClick={onNewAnimation}
          disabled={playing}
          aria-label="New animation"
          title="Start a brand new animation"
        >
          <Icon name="newFile" />
          <span>New</span>
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onExportGif}
          disabled={playing || exporting || totalFrames < 1}
          aria-label="Export animation as GIF"
          title="Save your animation as a GIF"
        >
          <Icon name="film" />
          <span>{exporting ? 'Saving…' : 'Export GIF'}</span>
        </button>
      </div>
    </div>
  )
}
