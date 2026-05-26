export type Mode = 'draw' | 'erase'
export type BrushShape = 'round' | 'square'

export interface ToolState {
  color: string
  brushSize: number
  brushShape: BrushShape
  mode: Mode
  pressureSensitive: boolean
}

export interface Artwork {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  width: number
  height: number
  thumbnail: string
  full: Blob
}

export interface SavedArtworkSummary {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  width: number
  height: number
  thumbnail: string
}
