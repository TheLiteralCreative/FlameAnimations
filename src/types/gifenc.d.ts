declare module 'gifenc' {
  export interface GifEncoderFrameOptions {
    palette?: number[][]
    delay?: number
    transparent?: boolean
    transparentIndex?: number
    repeat?: number
    first?: boolean
    dispose?: number
  }

  export interface GifEncoder {
    writeFrame: (
      index: Uint8Array,
      width: number,
      height: number,
      opts?: GifEncoderFrameOptions,
    ) => void
    finish: () => void
    bytes: () => Uint8Array
    bytesView: () => Uint8Array
    reset: () => void
  }

  export function GIFEncoder(opts?: { auto?: boolean; initialCapacity?: number }): GifEncoder

  export function quantize(
    rgba: Uint8Array | Uint8ClampedArray,
    maxColors: number,
    opts?: { format?: 'rgb565' | 'rgb444' | 'rgba4444'; clearAlpha?: boolean; clearAlphaThreshold?: number; oneBitAlpha?: boolean | number },
  ): number[][]

  export function applyPalette(
    rgba: Uint8Array | Uint8ClampedArray,
    palette: number[][],
    format?: 'rgb565' | 'rgb444' | 'rgba4444',
  ): Uint8Array
}
