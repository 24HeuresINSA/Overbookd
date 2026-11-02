import { GIFEncoder, applyPalette, quantize } from "gifenc";
import {
  GIF_MIME_TYPE,
  IMAGE_MAX_SIZE,
  JPEG_MIME_TYPE,
  WEBP_MIME_TYPE,
} from "@overbookd/http";

const MAX_DIMENSION_PX = 2048;
const MIN_DIMENSION_PX = 32;
const SCALE_FACTOR = 0.75;
const MAX_SCALE_STEPS = 20;
const QUALITIES = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
const ANIMATED_MIME_TYPES = [GIF_MIME_TYPE, WEBP_MIME_TYPE];
const MAX_GIF_COLORS = 256;
const MIN_FRAME_DELAY_MS = 20;

type EncodeResult = {
  fitting: Blob | null;
  smallest: Blob | null;
};

type AnimatedEncodeResult = {
  fitting: Uint8Array<ArrayBuffer> | null;
  smallest: Uint8Array<ArrayBuffer> | null;
};

const NO_ENCODE_RESULT: EncodeResult = { fitting: null, smallest: null };
const NO_ANIMATED_RESULT: AnimatedEncodeResult = {
  fitting: null,
  smallest: null,
};

export async function compressImage(
  file: File,
  maxSizeInBytes: number = IMAGE_MAX_SIZE,
): Promise<File> {
  if (file.size <= maxSizeInBytes) return file;

  const animated = await compressAnimatedImage(file, maxSizeInBytes);
  if (animated) return animated;

  const url = URL.createObjectURL(file);
  try {
    const image = await loadImage(url);
    const compressed = await compressImageElement(image, file, maxSizeInBytes);
    return compressed ?? file;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function compressAnimatedImage(
  file: File,
  maxSizeInBytes: number,
): Promise<File | null> {
  if (typeof ImageDecoder === "undefined") return null;
  if (!ANIMATED_MIME_TYPES.includes(file.type)) return null;

  const decoder = new ImageDecoder({
    data: await file.arrayBuffer(),
    type: file.type,
  });
  try {
    await decoder.tracks.ready;
    const track = decoder.tracks[0];
    if (!track || track.frameCount <= 1) return null;

    const firstFrame = await decoder.decode({ frameIndex: 0 });
    const naturalWidth = firstFrame.image.displayWidth;
    const naturalHeight = firstFrame.image.displayHeight;
    firstFrame.image.close();

    const scales = computeScales(naturalWidth, naturalHeight);
    const result = await scales.reduce<Promise<AnimatedEncodeResult>>(
      async (previous, scale) => {
        const acc = await previous;
        if (acc.fitting) return acc;
        const bytes = await encodeAnimatedGif(
          decoder,
          track.frameCount,
          naturalWidth,
          naturalHeight,
          scale,
        );
        if (!bytes) return acc;
        if (bytes.length <= maxSizeInBytes) {
          return { fitting: bytes, smallest: acc.smallest };
        }
        return { fitting: null, smallest: smallerBytes(bytes, acc.smallest) };
      },
      Promise.resolve(NO_ANIMATED_RESULT),
    );

    const bytes = result.fitting ?? result.smallest;
    return bytes ? animatedGifFile(bytes, file.name) : null;
  } catch {
    return null;
  } finally {
    decoder.close();
  }
}

async function encodeAnimatedGif(
  decoder: ImageDecoder,
  frameCount: number,
  naturalWidth: number,
  naturalHeight: number,
  scale: number,
): Promise<Uint8Array<ArrayBuffer> | null> {
  const width = Math.max(1, Math.round(naturalWidth * scale));
  const height = Math.max(1, Math.round(naturalHeight * scale));
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;
  canvas.width = width;
  canvas.height = height;

  const gif = GIFEncoder();
  const frameIndexes = Array.from({ length: frameCount }, (_, index) => index);
  await frameIndexes.reduce<Promise<void>>(async (previous, frameIndex) => {
    await previous;
    const { image: videoFrame } = await decoder.decode({ frameIndex });
    context.clearRect(0, 0, width, height);
    context.drawImage(videoFrame, 0, 0, width, height);
    const { data } = context.getImageData(0, 0, width, height);
    const palette = quantize(data, MAX_GIF_COLORS);
    gif.writeFrame(applyPalette(data, palette), width, height, {
      palette,
      delay: Math.max(
        MIN_FRAME_DELAY_MS,
        Math.round((videoFrame.duration ?? 0) / 1000),
      ),
    });
    videoFrame.close();
  }, Promise.resolve());

  gif.finish();
  return gif.bytes();
}

function animatedGifFile(
  bytes: Uint8Array<ArrayBuffer>,
  originalName: string,
): File {
  const baseName = originalName.replace(/\.[^/.]+$/, "") || "avatar";
  return new File([bytes], `${baseName}.gif`, { type: GIF_MIME_TYPE });
}

function smallerBytes(
  candidate: Uint8Array<ArrayBuffer>,
  current: Uint8Array<ArrayBuffer> | null,
): Uint8Array<ArrayBuffer> {
  return !current || candidate.length < current.length ? candidate : current;
}

async function loadImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
}

async function compressImageElement(
  image: HTMLImageElement,
  originalFile: File,
  maxSizeInBytes: number,
): Promise<File | null> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  const mimeType = supportsWebP(canvas) ? WEBP_MIME_TYPE : JPEG_MIME_TYPE;
  const scales = computeScales(image.naturalWidth, image.naturalHeight);

  const result = await scales.reduce<Promise<EncodeResult>>(
    async (previous, scale) => {
      const acc = await previous;
      if (acc.fitting) return acc;
      return encodeAtScale(
        canvas,
        context,
        image,
        mimeType,
        scale,
        maxSizeInBytes,
        acc.smallest,
      );
    },
    Promise.resolve(NO_ENCODE_RESULT),
  );

  const blob = result.fitting ?? result.smallest;
  return blob ? blobToFile(blob, originalFile.name, mimeType) : null;
}

async function encodeAtScale(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  mimeType: string,
  scale: number,
  maxSizeInBytes: number,
  smallest: Blob | null,
): Promise<EncodeResult> {
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  canvas.width = width;
  canvas.height = height;
  drawImageOnCanvas(context, image, mimeType, width, height);

  return QUALITIES.reduce<Promise<EncodeResult>>(
    async (previous, quality) => {
      const acc = await previous;
      if (acc.fitting) return acc;
      const blob = await canvasToBlob(canvas, mimeType, quality);
      if (!blob) return acc;
      if (blob.size <= maxSizeInBytes) {
        return { fitting: blob, smallest: acc.smallest };
      }
      return { fitting: null, smallest: smallerBlob(blob, acc.smallest) };
    },
    Promise.resolve({ fitting: null, smallest }),
  );
}

function drawImageOnCanvas(
  context: CanvasRenderingContext2D,
  image: CanvasImageSource,
  mimeType: string,
  width: number,
  height: number,
): void {
  if (mimeType === JPEG_MIME_TYPE) {
    context.fillStyle = "#FFFFFF";
    context.fillRect(0, 0, width, height);
  } else {
    context.clearRect(0, 0, width, height);
  }
  context.drawImage(image, 0, 0, width, height);
}

function computeScales(naturalWidth: number, naturalHeight: number): number[] {
  const maxDimension = Math.max(naturalWidth, naturalHeight);
  const firstScale = Math.min(1, MAX_DIMENSION_PX / maxDimension);
  const candidates = Array.from(
    { length: MAX_SCALE_STEPS },
    (_, step) => firstScale * SCALE_FACTOR ** step,
  );
  const scales = candidates.filter(
    (scale) => Math.round(maxDimension * scale) >= MIN_DIMENSION_PX,
  );
  return scales.length > 0 ? scales : [1];
}

function smallerBlob(candidate: Blob, current: Blob | null): Blob {
  return !current || candidate.size < current.size ? candidate : current;
}

function supportsWebP(canvas: HTMLCanvasElement): boolean {
  return canvas.toDataURL(WEBP_MIME_TYPE).startsWith(`data:${WEBP_MIME_TYPE}`);
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) =>
    canvas.toBlob((blob) => resolve(blob), mimeType, quality),
  );
}

function blobToFile(blob: Blob, originalName: string, mimeType: string): File {
  const extension = mimeType === WEBP_MIME_TYPE ? "webp" : "jpg";
  const baseName = originalName.replace(/\.[^/.]+$/, "") || "avatar";
  return new File([blob], `${baseName}.${extension}`, { type: mimeType });
}
