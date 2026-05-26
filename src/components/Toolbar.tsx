import { useApp } from '../state/AppContext'
import { ColorPicker } from './ColorPicker'
import { BrushControls } from './BrushControls'
import { Icon } from './Icon'

interface Props {
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onClear: () => void
  onSave: () => void
  onExport: () => void
  onOpenGallery: () => void
  onOpenHelp: () => void
  disabled?: boolean
}

export function Toolbar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onSave,
  onExport,
  onOpenGallery,
  onOpenHelp,
  disabled,
}: Props) {
  const { tool, setTool } = useApp()

  return (
    <header className="toolbar">
      <div className="toolbar-row toolbar-top">
        <div className="brand">
          <Icon name="flame" size={24} />
          <span>FlameAnimations</span>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="tool-btn"
            aria-label="Open gallery"
            onClick={onOpenGallery}
            disabled={disabled}
          >
            <Icon name="photos" />
          </button>
          <button
            type="button"
            className="tool-btn"
            aria-label="Help"
            onClick={onOpenHelp}
          >
            <Icon name="help" />
          </button>
        </div>
      </div>

      <div className="toolbar-row toolbar-tools">
        <ColorPicker />

        <div className="mode-toggle" role="group" aria-label="Tool mode">
          <button
            type="button"
            className={`tool-btn${tool.mode === 'draw' ? ' active' : ''}`}
            aria-pressed={tool.mode === 'draw'}
            aria-label="Brush"
            onClick={() => setTool({ mode: 'draw' })}
            disabled={disabled}
          >
            <Icon name="brush" />
          </button>
          <button
            type="button"
            className={`tool-btn${tool.mode === 'erase' ? ' active' : ''}`}
            aria-pressed={tool.mode === 'erase'}
            aria-label="Eraser"
            onClick={() => setTool({ mode: 'erase' })}
            disabled={disabled}
          >
            <Icon name="eraser" />
          </button>
        </div>

        <BrushControls />

        <div className="action-group">
          <button
            type="button"
            className="tool-btn"
            disabled={!canUndo || disabled}
            aria-label="Undo"
            onClick={onUndo}
          >
            <Icon name="undo" />
          </button>
          <button
            type="button"
            className="tool-btn"
            disabled={!canRedo || disabled}
            aria-label="Redo"
            onClick={onRedo}
          >
            <Icon name="redo" />
          </button>
          <button
            type="button"
            className="tool-btn"
            aria-label="Clear frame"
            onClick={onClear}
            disabled={disabled}
          >
            <Icon name="trash" />
          </button>
        </div>

        <div className="action-group save-group">
          <button
            type="button"
            className="btn"
            onClick={onSave}
            disabled={disabled}
            title="Save current frame to gallery"
          >
            <Icon name="save" />
            <span>Save Frame</span>
          </button>
          <button
            type="button"
            className="btn"
            onClick={onExport}
            disabled={disabled}
            title="Download current frame as PNG"
          >
            <Icon name="download" />
            <span>PNG</span>
          </button>
        </div>
      </div>
    </header>
  )
}
