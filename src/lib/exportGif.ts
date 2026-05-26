import { GIFEncoder, quantize, applyPalette } from 'gifenc'
import { BACKGROUND, type DrawingEngine } from './drawingEngine'
import type { FrameRecord } from '../types'

export const GIF_MAX_DIM = 640

async function frameToImageData(
  frame: FrameRecord,
  width: number,
  height: number,
): Promise<ImageData> {
  const off = document.createElement('canvas')
  off.width = width
  off.height = height
  const ctx = off.getContext('2d')
  if (!ctx) throw new Error('Could not get 2D context for GIF frame')
  ctx.fillStyle = BACKGROUND
  ctx.fillRect(0, 0, width, height)
  const bitmap = await createImageBitmap(frame.blob)
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close?.()
  return ctx.getImageData(0, 0, width, height)
}

interface EncodeOpts {
  fps: number
  onProgress?: (done: number, total: number) => void
}

export async function encodeAnimationToGif(
  frames: FrameRecord[],
  sourceWidth: number,
  sourceHeight: number,
  opts: EncodeOpts,
  _engine: DrawingEngine,
): Promise<Blob> {
  const ratio = sourceWidth / sourceHeight
  const width =
    sourceWidth > sourceHeight
      ? Math.min(sourceWidth, GIF_MAX_DIM)
      : Math.round(GIF_MAX_DIM * ratio)
  const height =
    sourceWidth > sourceHeight
      ? Math.round(width / ratio)
      : Math.min(sourceHeight, GIF_MAX_DIM)

  const gif = GIFEncoder()
  const delay = Math.max(2, Math.round(1000 / opts.fps))

  for (let i = 0; i < frames.length; i++) {
    const imageData = await frameToImageData(frames[i], width, height)
    const palette = quantize(imageData.data, 256)
    const index = applyPalette(imageData.data, palette)
    gif.writeFrame(index, width, height, { palette, delay })
    opts.onProgress?.(i + 1, frames.length)
    if (i % 8 === 0) await new Promise((r) => setTimeout(r, 0))
  }

  gif.finish()
  const bytes = gif.bytes()
  const buffer = new ArrayBuffer(bytes.byteLength)
  new Uint8Array(buffer).set(bytes)
  return new Blob([buffer], { type: 'image/gif' })
}
