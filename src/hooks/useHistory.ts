import { useCallback, useRef, useState } from 'react'
import type { DrawingEngine } from '../lib/drawingEngine'

const HISTORY_CAP = 50

interface HistoryAPI {
  push: () => Promise<void>
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  reset: () => Promise<void>
}

export function useHistory(engine: DrawingEngine): HistoryAPI {
  const undoStack = useRef<ImageBitmap[]>([])
  const redoStack = useRef<ImageBitmap[]>([])
  const [, force] = useState(0)
  const bump = useCallback(() => force((n) => n + 1), [])

  const push = useCallback(async () => {
    const snap = await engine.snapshot()
    if (!snap) return
    undoStack.current.push(snap)
    if (undoStack.current.length > HISTORY_CAP) {
      const dropped = undoStack.current.shift()
      dropped?.close?.()
    }
    redoStack.current.forEach((b) => b.close?.())
    redoStack.current = []
    bump()
  }, [engine, bump])

  const undo = useCallback(() => {
    if (undoStack.current.length <= 1) return
    const current = undoStack.current.pop()
    if (current) redoStack.current.push(current)
    const prev = undoStack.current[undoStack.current.length - 1]
    if (prev) engine.restore(prev)
    bump()
  }, [engine, bump])

  const redo = useCallback(() => {
    const next = redoStack.current.pop()
    if (!next) return
    engine.restore(next)
    undoStack.current.push(next)
    bump()
  }, [engine, bump])

  const reset = useCallback(async () => {
    undoStack.current.forEach((b) => b.close?.())
    redoStack.current.forEach((b) => b.close?.())
    undoStack.current = []
    redoStack.current = []
    const snap = await engine.snapshot()
    if (snap) undoStack.current.push(snap)
    bump()
  }, [engine, bump])

  return {
    push,
    undo,
    redo,
    reset,
    canUndo: undoStack.current.length > 1,
    canRedo: redoStack.current.length > 0,
  }
}
