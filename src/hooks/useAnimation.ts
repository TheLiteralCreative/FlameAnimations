import { useCallback, useEffect, useRef, useState } from 'react'
import {
  loadCurrentAnimation,
  saveCurrentAnimation,
  clearCurrentAnimation,
} from '../lib/idb'
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  type DrawingEngine,
} from '../lib/drawingEngine'
import { DEFAULT_FPS, MAX_FRAMES, type FrameRecord } from '../types'

const SAVE_DEBOUNCE_MS = 600

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

interface UseAnimationOpts {
  engine: DrawingEngine
  onionEnabled: boolean
  onionOpacity: number
  onError: (msg: string) => void
}

export function useAnimation({
  engine,
  onionEnabled,
  onionOpacity,
  onError,
}: UseAnimationOpts) {
  const [frames, setFrames] = useState<FrameRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)

  const framesRef = useRef<FrameRecord[]>([])
  const currentIndexRef = useRef(0)
  framesRef.current = frames
  currentIndexRef.current = currentIndex

  const saveTimer = useRef<number | null>(null)

  const persist = useCallback(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current)
    saveTimer.current = window.setTimeout(() => {
      saveCurrentAnimation({
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        fps: DEFAULT_FPS,
        frames: framesRef.current,
        currentIndex: currentIndexRef.current,
        updatedAt: Date.now(),
      }).catch((e) => {
        onError(e instanceof Error ? e.message : 'Failed to save animation')
      })
    }, SAVE_DEBOUNCE_MS)
  }, [onError])

  const drawOnionFor = useCallback(
    async (index: number) => {
      if (!onionEnabled || index <= 0) {
        engine.clearOnion()
        return
      }
      const prev = framesRef.current[index - 1]
      if (!prev) {
        engine.clearOnion()
        return
      }
      await engine.drawOnion(prev.blob, onionOpacity)
    },
    [engine, onionEnabled, onionOpacity],
  )

  const showFrame = useCallback(
    async (index: number) => {
      const frame = framesRef.current[index]
      await engine.loadFrame(frame ? frame.blob : null)
      await drawOnionFor(index)
    },
    [engine, drawOnionFor],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const doc = await loadCurrentAnimation()
        if (cancelled) return
        if (doc && doc.frames.length > 0) {
          setFrames(doc.frames)
          const idx = Math.min(doc.currentIndex, doc.frames.length - 1)
          framesRef.current = doc.frames
          currentIndexRef.current = idx
          setCurrentIndex(idx)
          await engine.loadFrame(doc.frames[idx].blob)
        } else {
          const blob = await engine.toFrameBlob()
          const thumbnail = await engine.generateThumbnailFromBlob(blob)
          const initial: FrameRecord = { id: uid(), blob: blob!, thumbnail }
          setFrames([initial])
          framesRef.current = [initial]
        }
        setReady(true)
      } catch (e) {
        onError(e instanceof Error ? e.message : 'Failed to load animation')
        setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [engine, onError])

  useEffect(() => {
    if (!ready) return
    drawOnionFor(currentIndexRef.current)
  }, [onionEnabled, onionOpacity, ready, drawOnionFor])

  const commitCurrentFrame = useCallback(async () => {
    const blob = await engine.toFrameBlob()
    if (!blob) return
    const thumbnail = await engine.generateThumbnailFromBlob(blob)
    const idx = currentIndexRef.current
    setFrames((prev) => {
      if (prev.length === 0) {
        const f: FrameRecord = { id: uid(), blob, thumbnail }
        framesRef.current = [f]
        return [f]
      }
      const next = prev.slice()
      const existing = next[idx]
      next[idx] = { id: existing?.id ?? uid(), blob, thumbnail }
      framesRef.current = next
      return next
    })
    persist()
  }, [engine, persist])

  const goToFrame = useCallback(
    async (index: number) => {
      const total = framesRef.current.length
      if (index < 0 || index >= total) return
      currentIndexRef.current = index
      setCurrentIndex(index)
      await showFrame(index)
      persist()
    },
    [showFrame, persist],
  )

  const prevFrame = useCallback(async () => {
    const idx = currentIndexRef.current
    if (idx <= 0) return
    await goToFrame(idx - 1)
  }, [goToFrame])

  const nextFrame = useCallback(async () => {
    const idx = currentIndexRef.current
    const total = framesRef.current.length
    if (idx < total - 1) {
      await goToFrame(idx + 1)
      return
    }
    if (total >= MAX_FRAMES) {
      onError(`Frame limit reached (${MAX_FRAMES} frames max).`)
      return
    }
    await engine.loadFrame(null)
    const blob = await engine.toFrameBlob()
    const thumbnail = await engine.generateThumbnailFromBlob(blob)
    const newFrame: FrameRecord = { id: uid(), blob: blob!, thumbnail }
    const newIndex = total
    const next = [...framesRef.current, newFrame]
    framesRef.current = next
    currentIndexRef.current = newIndex
    setFrames(next)
    setCurrentIndex(newIndex)
    await drawOnionFor(newIndex)
    persist()
  }, [engine, drawOnionFor, goToFrame, onError, persist])

  const newAnimation = useCallback(async () => {
    setPlaying(false)
    await engine.loadFrame(null)
    const blob = await engine.toFrameBlob()
    const thumbnail = await engine.generateThumbnailFromBlob(blob)
    const initial: FrameRecord = { id: uid(), blob: blob!, thumbnail }
    framesRef.current = [initial]
    currentIndexRef.current = 0
    setFrames([initial])
    setCurrentIndex(0)
    engine.clearOnion()
    try {
      await clearCurrentAnimation()
    } catch {
      // non-fatal
    }
    persist()
  }, [engine, persist])

  const playingRef = useRef(false)
  playingRef.current = playing

  useEffect(() => {
    if (!playing) return
    const total = framesRef.current.length
    if (total <= 1) {
      setPlaying(false)
      return
    }
    let cancelled = false
    let lastTime = performance.now()
    let acc = 0
    const interval = 1000 / DEFAULT_FPS
    let displayIndex = currentIndexRef.current

    engine.clearOnion()

    const tick = (t: number) => {
      if (cancelled) return
      acc += t - lastTime
      lastTime = t
      while (acc >= interval) {
        acc -= interval
        displayIndex = (displayIndex + 1) % framesRef.current.length
        const frame = framesRef.current[displayIndex]
        if (frame) engine.loadFrame(frame.blob)
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)

    return () => {
      cancelled = true
      drawOnionFor(currentIndexRef.current)
      engine.loadFrame(framesRef.current[currentIndexRef.current]?.blob ?? null)
    }
  }, [playing, engine, drawOnionFor])

  const togglePlay = useCallback(() => {
    if (framesRef.current.length <= 1) {
      onError('Add more frames first — press ▶▶ to make a new frame.')
      return
    }
    setPlaying((p) => !p)
  }, [onError])

  return {
    frames,
    currentIndex,
    playing,
    ready,
    commitCurrentFrame,
    goToFrame,
    prevFrame,
    nextFrame,
    togglePlay,
    newAnimation,
  }
}
