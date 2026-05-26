import { Icon } from './Icon'

interface Props {
  enabled: boolean
  opacity: number
  canUse: boolean
  onToggle: () => void
  onOpacityChange: (n: number) => void
}

export function OnionControls({
  enabled,
  opacity,
  canUse,
  onToggle,
  onOpacityChange,
}: Props) {
  return (
    <div
      className={`onion-controls${enabled ? ' active' : ''}${
        canUse ? '' : ' disabled'
      }`}
      role="group"
      aria-label="Onion skin overlay"
    >
      <button
        type="button"
        className={`tool-btn onion-toggle${enabled ? ' active' : ''}`}
        aria-pressed={enabled}
        aria-label={enabled ? 'Turn off onion skin' : 'Turn on onion skin'}
        title={
          canUse
            ? 'Onion skin: see the previous frame underneath'
            : 'Onion skin (needs an earlier frame to show)'
        }
        onClick={onToggle}
        disabled={!canUse}
      >
        <Icon name="onion" />
      </button>
      {enabled ? (
        <input
          type="range"
          className="onion-opacity"
          min={0.1}
          max={0.9}
          step={0.05}
          value={opacity}
          onChange={(e) => onOpacityChange(Number(e.target.value))}
          aria-label="Onion skin opacity"
        />
      ) : null}
    </div>
  )
}
