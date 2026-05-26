import type { ReactNode } from 'react'

interface IconProps {
  name: IconName
  size?: number
  className?: string
}

export type IconName =
  | 'brush'
  | 'eraser'
  | 'square'
  | 'circle'
  | 'undo'
  | 'redo'
  | 'trash'
  | 'save'
  | 'download'
  | 'plus'
  | 'photos'
  | 'help'
  | 'x'
  | 'check'
  | 'flame'
  | 'pressure'
  | 'stepBack'
  | 'stepForward'
  | 'play'
  | 'stop'
  | 'film'
  | 'newFile'
  | 'onion'

const PATHS: Record<IconName, ReactNode> = {
  brush: (
    <>
      <path d="M3 21c1.5 0 3-.5 4-1.5l9-9-3-3-9 9C3 17.5 2.5 19 3 21z" />
      <path d="m14.5 5.5 4 4" />
      <path d="m13 7 4 4" />
      <path d="M16 2l6 6-4 4-6-6 4-4z" />
    </>
  ),
  eraser: (
    <>
      <path d="m7 21-4-4 11-11 4 4-11 11z" />
      <path d="M16 7 21 12" />
      <path d="M5 21h16" />
    </>
  ),
  square: <rect x="4" y="4" width="16" height="16" rx="2" />,
  circle: <circle cx="12" cy="12" r="8" />,
  undo: (
    <>
      <path d="M3 7v6h6" />
      <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
    </>
  ),
  redo: (
    <>
      <path d="M21 7v6h-6" />
      <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6 18 20a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </>
  ),
  save: (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </>
  ),
  download: (
    <>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="M7 10l5 5 5-5" />
      <path d="M12 15V3" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  photos: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  help: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4" />
      <path d="M12 17h.01" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </>
  ),
  check: <path d="M5 12l5 5L20 7" />,
  flame: (
    <path d="M12 2s5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 1-3s-1 3 1 3 2-2 2-4c0-3-1-5 1-6z M8 14a4 4 0 0 0 8 0c0-2-1-3-2-3s0 2-1 2-1-1-1-2-1-2-2-1-2 2-2 4z" />
  ),
  pressure: (
    <>
      <path d="M3 21h18" />
      <path d="M5 17l4-12 4 6 3-3 3 9" />
    </>
  ),
  stepBack: (
    <>
      <polygon points="19,5 8,12 19,19" fill="currentColor" stroke="none" />
      <line x1="5" y1="5" x2="5" y2="19" />
    </>
  ),
  stepForward: (
    <>
      <polygon points="5,5 16,12 5,19" fill="currentColor" stroke="none" />
      <line x1="19" y1="5" x2="19" y2="19" />
    </>
  ),
  play: (
    <polygon points="6,4 20,12 6,20" fill="currentColor" stroke="none" />
  ),
  stop: (
    <rect x="5" y="5" width="14" height="14" rx="1.5" fill="currentColor" stroke="none" />
  ),
  film: (
    <>
      <rect x="2.5" y="4" width="19" height="16" rx="2" />
      <line x1="7" y1="4" x2="7" y2="20" />
      <line x1="17" y1="4" x2="17" y2="20" />
      <line x1="2.5" y1="9" x2="7" y2="9" />
      <line x1="2.5" y1="15" x2="7" y2="15" />
      <line x1="17" y1="9" x2="21.5" y2="9" />
      <line x1="17" y1="15" x2="21.5" y2="15" />
    </>
  ),
  newFile: (
    <>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <polyline points="14 3 14 9 20 9" />
      <line x1="12" y1="13" x2="12" y2="19" />
      <line x1="9" y1="16" x2="15" y2="16" />
    </>
  ),
  onion: (
    <>
      <ellipse cx="12" cy="12" rx="9" ry="5" />
      <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(120 12 12)" />
    </>
  ),
}

export function Icon({ name, size = 22, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
