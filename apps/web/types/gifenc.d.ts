declare module "gifenc" {
  export type GifPalette = number[][];

  export function quantize(
    rgba: Uint8ClampedArray | Uint8Array,
    maxColors: number,
    options?: object,
  ): GifPalette;

  export function applyPalette(
    rgba: Uint8ClampedArray | Uint8Array,
    palette: GifPalette,
    format?: string,
  ): Uint8Array;

  export function GIFEncoder(): {
    writeFrame: (
      index: Uint8Array,
      width: number,
      height: number,
      options?: {
        palette?: GifPalette;
        delay?: number;
        transparent?: boolean;
        transparentIndex?: number;
        dispose?: number;
        repeat?: number;
      },
    ) => void;
    finish: () => void;
    bytes: () => Uint8Array<ArrayBuffer>;
    bytesView: () => Uint8Array<ArrayBuffer>;
  };
}
