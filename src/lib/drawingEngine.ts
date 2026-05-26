import type { BrushShape, Mode, ToolState } from '../types'

export const CANVAS_WIDTH = 1600
export const CANVAS_HEIGHT = 1000
export const BACKGROUND = '#ffffff'

interface StrokePoint {
  x: number
  y: number
  pressure: number
}

export class DrawingEngine {
  canvas: HTMLCanvasElement | null = null
  ctx: CanvasRenderingContext2D | null = null
  onionCanvas: HTMLCanvasElement | null = null
  onionCtx: CanvasRenderingContext2D | null = null
  private drawing = false
  private last: StrokePoint | null = null
  private color = '#000000'
  private brushSize = 8
  private brushShape: BrushShape = 'round'
  private mode: Mode = 'draw'
  private pressureSensitive = true

  attach(canvas: HTMLCanvasElement, onionCanvas?: HTMLCanvasElement) {
    this.canvas = canvas
    canvas.width = CANVAS_WIDTH
    canvas.height = CANVAS_HEIGHT
    const ctx = canvas.getContext('2d', { willReadFrequently: false })
    if (!ctx) throw new Error('2D canvas context unavailable')
    this.ctx = ctx
    this.clear()

    if (onionCanvas) {
      this.onionCanvas = onionCanvas
      onionCanvas.width = CANVAS_WIDTH
      onionCanvas.height = CANVAS_HEIGHT
      this.onionCtx = onionCanvas.getContext('2d')
    }
  }

  setTool(tool: ToolState) {
    this.color = tool.color
    this.brushSize = tool.brushSize
    this.brushShape = tool.brushShape
    this.mode = tool.mode
    this.pressureSensitive = tool.pressureSensitive
  }

  clear() {
    if (!this.ctx || !this.canvas) return
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  clearOnion() {
    if (!this.onionCtx || !this.onionCanvas) return
    this.onionCtx.clearRect(0, 0, this.onionCanvas.width, this.onionCanvas.height)
  }

  async drawOnion(blob: Blob, opacity: number) {
    if (!this.onionCtx || !this.onionCanvas) return
    this.clearOnion()
    const bitmap = await createImageBitmap(blob)
    this.onionCtx.save()
    this.onionCtx.globalAlpha = opacity
    this.onionCtx.drawImage(
      bitmap,
      0,
      0,
      this.onionCanvas.width,
      this.onionCanvas.height,
    )
    this.onionCtx.restore()
    bitmap.close?.()
  }

  private applyStrokeStyle() {
    const ctx = this.ctx
    if (!ctx) return
    ctx.lineCap = this.brushShape === 'round' ? 'round' : 'square'
    ctx.lineJoin = this.brushShape === 'round' ? 'round' : 'miter'
    if (this.mode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.strokeStyle = '#000'
      ctx.fillStyle = '#000'
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = this.color
      ctx.fillStyle = this.color
    }
  }

  private effectiveSize(pressure: number) {
    if (!this.pressureSensitive || pressure <= 0) return this.brushSize
    const min = Math.max(1, this.brushSize * 0.35)
    return min + (this.brushSize - min) * Math.min(1, pressure * 1.5)
  }

  beginStroke(x: number, y: number, pressure = 0.5) {
    const ctx = this.ctx
    if (!ctx) return
    this.drawing = true
    this.applyStrokeStyle()
    const size = this.effectiveSize(pressure)
    ctx.lineWidth = size
    ctx.beginPath()
    if (this.brushShape === 'round') {
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    }
    ctx.beginPath()
    ctx.moveTo(x, y)
    this.last = { x, y, pressure }
  }

  extendStroke(x: number, y: number, pressure = 0.5) {
    const ctx = this.ctx
    if (!ctx || !this.drawing || !this.last) return
    this.applyStrokeStyle()
    const size = this.effectiveSize(pressure)
    ctx.lineWidth = size
    const midX = (this.last.x + x) / 2
    const midY = (this.last.y + y) / 2
    ctx.beginPath()
    ctx.moveTo(this.last.x, this.last.y)
    ctx.quadraticCurveTo(this.last.x, this.last.y, midX, midY)
    ctx.stroke()
    this.last = { x, y, pressure }
  }

  endStroke() {
    if (!this.ctx) return
    this.drawing = false
    this.last = null
  }

  async snapshot(): Promise<ImageBitmap | null> {
    if (!this.canvas) return null
    return await createImageBitmap(this.canvas)
  }

  restore(bitmap: ImageBitmap) {
    const ctx = this.ctx
    const canvas = this.canvas
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  }

  async restoreFromBlob(blob: Blob) {
    const bitmap = await createImageBitmap(blob)
    this.restore(bitmap)
    bitmap.close?.()
  }

  async loadFrame(blob: Blob | null) {
    const ctx = this.ctx
    const canvas = this.canvas
    if (!ctx || !canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (!blob) return
    const bitmap = await createImageBitmap(blob)
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close?.()
  }

  async toFrameBlob(type = 'image/png'): Promise<Blob | null> {
    const canvas = this.canvas
    if (!canvas) return null
    return await new Promise((resolve) => canvas.toBlob(resolve, type))
  }

  async toExportBlob(type = 'image/png'): Promise<Blob | null> {
    const canvas = this.canvas
    if (!canvas) return null
    const off = document.createElement('canvas')
    off.width = canvas.width
    off.height = canvas.height
    const octx = off.getContext('2d')
    if (!octx) return null
    octx.fillStyle = BACKGROUND
    octx.fillRect(0, 0, off.width, off.height)
    octx.drawImage(canvas, 0, 0)
    return await new Promise((resolve) => off.toBlob(resolve, type))
  }

  async compositeFrame(
    frameBlob: Blob,
    width: number,
    height: number,
  ): Promise<HTMLCanvasElement> {
    const off = document.createElement('canvas')
    off.width = width
    off.height = height
    const octx = off.getContext('2d')!
    octx.fillStyle = BACKGROUND
    octx.fillRect(0, 0, width, height)
    const bitmap = await createImageBitmap(frameBlob)
    octx.drawImage(bitmap, 0, 0, width, height)
    bitmap.close?.()
    return off
  }

  generateThumbnail(maxDim = 256): string {
    const canvas = this.canvas
    if (!canvas) return ''
    const ratio = canvas.width / canvas.height
    const w = ratio >= 1 ? maxDim : Math.round(maxDim * ratio)
    const h = ratio >= 1 ? Math.round(maxDim / ratio) : maxDim
    const off = document.createElement('canvas')
    off.width = w
    off.height = h
    const octx = off.getContext('2d')
    if (!octx) return ''
    octx.fillStyle = BACKGROUND
    octx.fillRect(0, 0, w, h)
    octx.drawImage(canvas, 0, 0, w, h)
    return off.toDataURL('image/png')
  }

  async generateThumbnailFromBlob(
    blob: Blob | null,
    maxDim = 96,
  ): Promise<string> {
    const ratio = CANVAS_WIDTH / CANVAS_HEIGHT
    const w = ratio >= 1 ? maxDim : Math.round(maxDim * ratio)
    const h = ratio >= 1 ? Math.round(maxDim / ratio) : maxDim
    const off = document.createElement('canvas')
    off.width = w
    off.height = h
    const octx = off.getContext('2d')
    if (!octx) return ''
    octx.fillStyle = BACKGROUND
    octx.fillRect(0, 0, w, h)
    if (blob) {
      const bitmap = await createImageBitmap(blob)
      octx.drawImage(bitmap, 0, 0, w, h)
      bitmap.close?.()
    }
    return off.toDataURL('image/png')
  }

  pointToCanvas(clientX: number, clientY: number): { x: number; y: number } | null {
    const canvas = this.canvas
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const x = ((clientX - rect.left) / rect.width) * canvas.width
    const y = ((clientY - rect.top) / rect.height) * canvas.height
    return { x, y }
  }
}
