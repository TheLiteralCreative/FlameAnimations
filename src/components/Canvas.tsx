import { useEffect, useRef, type ReactNode } from 'react'
import { useApp } from '../state/AppContext'

interface CanvasProps {
  onStrokeEnd: () => void
  drawingEnabled: boolean
  overlay?: ReactNode
}

export function Canvas({ onStrokeEnd, drawingEnabled, overlay }: CanvasProps) {
  const { engine } = useApp()
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const onionRef = useRef<HTMLCanvasElement | null>(null)
  const activePointerId = useRef<number | null>(null)
  const enabledRef = useRef(drawingEnabled)
  enabledRef.current = drawingEnabled

  useEffect(() => {
    const canvas = canvasRef.current
    const onion = onionRef.current
    if (!canvas) return
    engine.attach(canvas, onion ?? undefined)
  }, [engine])

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
    <div className="canvas-frame">
      <div className="canvas-stack">
        <div className="canvas-bg" aria-hidden="true" />
        <canvas ref={onionRef} className="onion-canvas" aria-hidden="true" />
        <canvas ref={canvasRef} className="drawing-canvas" />
        {overlay}
      </div>
    </div>
  )
}
