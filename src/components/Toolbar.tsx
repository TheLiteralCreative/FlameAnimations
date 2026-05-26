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
          >
            <Icon name="brush" />
          </button>
          <button
            type="button"
            className={`tool-btn${tool.mode === 'erase' ? ' active' : ''}`}
            aria-pressed={tool.mode === 'erase'}
            aria-label="Eraser"
            onClick={() => setTool({ mode: 'erase' })}
          >
            <Icon name="eraser" />
          </button>
        </div>

        <BrushControls />

        <div className="action-group">
          <button
            type="button"
            className="tool-btn"
            disabled={!canUndo}
            aria-label="Undo"
            onClick={onUndo}
          >
            <Icon name="undo" />
          </button>
          <button
            type="button"
            className="tool-btn"
            disabled={!canRedo}
            aria-label="Redo"
            onClick={onRedo}
          >
            <Icon name="redo" />
          </button>
          <button
            type="button"
            className="tool-btn"
            aria-label="Clear canvas"
            onClick={onClear}
          >
            <Icon name="trash" />
          </button>
        </div>

        <div className="action-group save-group">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onSave}
          >
            <Icon name="save" />
            <span>Save</span>
          </button>
          <button type="button" className="btn" onClick={onExport}>
            <Icon name="download" />
            <span>PNG</span>
          </button>
        </div>
      </div>
    </header>
  )
}
