import { useApp } from '../state/AppContext'
import { DEFAULT_PALETTE } from '../lib/palettes'

export function ColorPicker() {
  const { tool, setTool } = useApp()

  return (
    <div className="color-picker" role="group" aria-label="Color palette">
      {DEFAULT_PALETTE.map((c) => {
        const isActive = tool.color.toLowerCase() === c.toLowerCase()
        return (
          <button
            key={c}
            type="button"
            className={`swatch${isActive ? ' active' : ''}`}
            style={{ background: c }}
            aria-label={`Use color ${c}`}
            aria-pressed={isActive}
            onClick={() => setTool({ color: c, mode: 'draw' })}
          />
        )
      })}
      <label className="swatch custom" aria-label="Pick a custom color">
        <input
          type="color"
          value={tool.color}
          onChange={(e) => setTool({ color: e.target.value, mode: 'draw' })}
        />
        <span aria-hidden="true">+</span>
      </label>
    </div>
  )
}
