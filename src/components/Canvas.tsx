import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { useApp } from '../state/AppContext'

interface CanvasProps {
  onStrokeEnd: () => void
  drawingEnabled: boolean
  overlay?: ReactNode
}

const ASPECT = 8 / 5

export function Canvas({ onStrokeEnd, drawingEnabled, overlay }: CanvasProps) {
  const { engine } = useApp()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onionRef = useRef<HTMLCanvasElement | null>(null)
  const frameRef = useRef<HTMLDivElement | null>(null)
  const stackRef = useRef<HTMLDivElement | null>(null)
  const activePointerId = useRef<number | null>(null)
  const enabledRef = useRef(drawingEnabled)
  enabledRef.current = drawingEnabled

  useEffect(() => {
    const canvas = canvasRef.current
    const onion = onionRef.current
    if (!canvas) return
    engine.attach(canvas, onion ?? undefined)
  }, [engine])

  useLayoutEffect(() => {
    const frame = frameRef.current
    const stack = stackRef.current
    if (!frame || !stack) return
    const fit = () => {
      const w = frame.clientWidth
      const h = frame.clientHeight
      if (w === 0 || h === 0) return
      let fw = w
      let fh = w / ASPECT
      if (fh > h) {
        fh = h
        fw = h * ASPECT
      }
      stack.style.width = `${Math.floor(fw)}px`
      stack.style.height = `${Math.floor(fh)}px`
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(frame)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onPointerDown = (e: PointerEvent) => {
      if (!enabledRef.current) return
      if (activePointerId.current !== null) return
      canvas.setPointerCapture(e.pointerId)
      activePointerId.current = e.pointerId
      const pt = engine.pointToCanvas(e.clientX, e.clientY)
      if (!pt) return
      engine.beginStroke(pt.x, pt.y, e.pressure || 0.5)
      e.preventDefault()
    }

    const onPointerMove = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return
      const pt = engine.pointToCanvas(e.clientX, e.clientY)
      if (!pt) return
      engine.extendStroke(pt.x, pt.y, e.pressure || 0.5)
      e.preventDefault()
    }

    const finish = (e: PointerEvent) => {
      if (activePointerId.current !== e.pointerId) return
      engine.endStroke()
      activePointerId.current = null
      try {
        canvas.releasePointerCapture(e.pointerId)
      } catch {
        // ignore if already released
      }
      onStrokeEnd()
    }

    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', finish)
    canvas.addEventListener('pointercancel', finish)
    canvas.addEventListener('pointerleave', finish)

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', finish)
      canvas.removeEventListener('pointercancel', finish)
      canvas.removeEventListener('pointerleave', finish)
    }
  }, [engine, onStrokeEnd])

  return (
    <div className="canvas-frame" ref={frameRef}>
      <div className="canvas-stack" ref={stackRef}>
        <canvas ref={canvasRef} className="drawing-canvas" />
        <canvas ref={onionRef} className="onion-canvas" aria-hidden="true" />
        {overlay}
      </div>
    </div>
  )
}
