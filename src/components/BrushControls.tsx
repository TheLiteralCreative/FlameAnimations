import { useApp } from '../state/AppContext'
import { BRUSH_MAX, BRUSH_MIN } from '../lib/palettes'
import { Icon } from './Icon'

export function BrushControls() {
  const { tool, setTool } = useApp()

  return (
    <div className="brush-controls">
      <div className="shape-toggle" role="group" aria-label="Brush shape">
        <button
          type="button"
          className={`tool-btn${tool.brushShape === 'round' ? ' active' : ''}`}
          aria-pressed={tool.brushShape === 'round'}
          aria-label="Round brush"
          onClick={() => setTool({ brushShape: 'round' })}
        >
          <Icon name="circle" />
        </button>
        <button
          type="button"
          className={`tool-btn${tool.brushShape === 'square' ? ' active' : ''}`}
          aria-pressed={tool.brushShape === 'square'}
          aria-label="Square brush"
          onClick={() => setTool({ brushShape: 'square' })}
        >
          <Icon name="square" />
        </button>
      </div>

      <div className="size-row">
        <span
          className="size-preview"
          style={{
            width: tool.brushSize,
            height: tool.brushSize,
            borderRadius: tool.brushShape === 'round' ? '50%' : 4,
            background: tool.mode === 'erase' ? 'transparent' : tool.color,
            border:
              tool.mode === 'erase'
                ? '2px dashed var(--border-strong)'
                : '1px solid var(--border)',
          }}
          aria-hidden="true"
        />
        <input
          type="range"
          min={BRUSH_MIN}
          max={BRUSH_MAX}
          step={1}
          value={tool.brushSize}
          onChange={(e) => setTool({ brushSize: Number(e.target.value) })}
          aria-label="Brush size"
        />
        <span className="size-num" aria-hidden="true">
          {tool.brushSize}
        </span>
      </div>

      <button
        type="button"
        className={`tool-btn pressure${tool.pressureSensitive ? ' active' : ''}`}
        aria-pressed={tool.pressureSensitive}
        aria-label={`Pencil pressure ${tool.pressureSensitive ? 'on' : 'off'}`}
        title="Apple Pencil pressure"
        onClick={() => setTool({ pressureSensitive: !tool.pressureSensitive })}
      >
        <Icon name="pressure" />
      </button>
    </div>
  )
}
