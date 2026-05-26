import { useEffect, useRef } from 'react'
import type { FrameRecord } from '../types'

interface Props {
  frames: FrameRecord[]
  currentIndex: number
  onSelect: (index: number) => void
  disabled?: boolean
}

export function Filmstrip({ frames, currentIndex, onSelect, disabled }: Props) {
  const activeRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'center',
    })
  }, [currentIndex])

  if (frames.length === 0) return null

  return (
    <div className="filmstrip" aria-label="Animation frames">
      <ul>
        {frames.map((f, i) => {
          const isActive = i === currentIndex
          return (
            <li key={f.id}>
              <button
                ref={isActive ? activeRef : undefined}
                type="button"
                className={`filmstrip-thumb${isActive ? ' active' : ''}`}
                aria-label={`Frame ${i + 1}${isActive ? ' (current)' : ''}`}
                aria-pressed={isActive}
                onClick={() => onSelect(i)}
                disabled={disabled}
              >
                <img src={f.thumbnail} alt="" />
                <span className="filmstrip-num">{i + 1}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
