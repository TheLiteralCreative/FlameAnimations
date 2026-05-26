import { useCallback, useMemo, useRef, useState } from 'react'
import type { DrawingEngine } from '../lib/drawingEngine'

const HISTORY_CAP = 50

interface FrameStack {
  undo: ImageBitmap[]
  redo: ImageBitmap[]
}

export interface HistoryAPI {
  push: () => Promise<void>
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  ensureBaseline: (frameId: string) => Promise<void>
  dropFrame: (frameId: string) => void
  clearAll: () => void
}

export function useHistory(
  engine: DrawingEngine,
  frameId: string | undefined,
): HistoryAPI {
  const stacks = useRef<Map<string, FrameStack>>(new Map())
  const [, setVersion] = useState(0)
  const bump = useCallback(() => setVersion((v) => v + 1), [])

  const ensureStack = useCallback((id: string): FrameStack => {
    let s = stacks.current.get(id)
    if (!s) {
      s = { undo: [], redo: [] }
      stacks.current.set(id, s)
    }
    return s
  }, [])

  const push = useCallback(async () => {
    if (!frameId) return
    const snap = await engine.snapshot()
    if (!snap) return
    const s = ensureStack(frameId)
    s.undo.push(snap)
    if (s.undo.length > HISTORY_CAP) {
      const dropped = s.undo.shift()
      dropped?.close?.()
    }
    s.redo.forEach((b) => b.close?.())
    s.redo = []
    bump()
  }, [engine, frameId, ensureStack, bump])

  const undo = useCallback(() => {
    if (!frameId) return
    const s = stacks.current.get(frameId)
    if (!s || s.undo.length <= 1) return
    const current = s.undo.pop()
    if (current) s.redo.push(current)
    const prev = s.undo[s.undo.length - 1]
    if (prev) engine.restore(prev)
    bump()
  }, [engine, frameId, bump])

  const redo = useCallback(() => {
    if (!frameId) return
    const s = stacks.current.get(frameId)
    if (!s || s.redo.length === 0) return
    const next = s.redo.pop()
    if (!next) return
    engine.restore(next)
    s.undo.push(next)
    bump()
  }, [engine, frameId, bump])

  const ensureBaseline = useCallback(
    async (id: string) => {
      const s = ensureStack(id)
      if (s.undo.length > 0) return
      const snap = await engine.snapshot()
      if (!snap) return
      s.undo.push(snap)
      bump()
    },
    [engine, ensureStack, bump],
  )

  const dropFrame = useCallback((id: string) => {
    const s = stacks.current.get(id)
    if (!s) return
    s.undo.forEach((b) => b.close?.())
    s.redo.forEach((b) => b.close?.())
    stacks.current.delete(id)
  }, [])

  const clearAll = useCallback(() => {
    for (const s of stacks.current.values()) {
      s.undo.forEach((b) => b.close?.())
      s.redo.forEach((b) => b.close?.())
    }
    stacks.current.clear()
    bump()
  }, [bump])

  const current = frameId ? stacks.current.get(frameId) : undefined
  const canUndo = (current?.undo.length ?? 0) > 1
  const canRedo = (current?.redo.length ?? 0) > 0

  return useMemo<HistoryAPI>(
    () => ({
      push,
      undo,
      redo,
      canUndo,
      canRedo,
      ensureBaseline,
      dropFrame,
      clearAll,
    }),
    [push, undo, redo, canUndo, canRedo, ensureBaseline, dropFrame, clearAll],
  )
}
