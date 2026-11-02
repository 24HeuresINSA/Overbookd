import { encodeAnimation, type WebPAnimationFrame } from "wasm-webp";
import {
  ANIMATED_MIME_TYPES,
  IMAGE_MAX_SIZE,
  JPEG_MIME_TYPE,
  WEBP_MIME_TYPE,
} from "@overbookd/http";

const MAX_DIMENSION_PX = 2048;
const MIN_DIMENSION_PX = 32;
const SCALE_FACTOR = 0.75;
const MAX_SCALE_STEPS = 20;
const QUALITIES = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];
const MIN_FRAME_DURATION_MS = 20;

type Candidate = {
  size: number;
  blob: Blob;
};

type SearchResult = {
  fitting: Candidate | null;
  smallest: Candidate | null;
};

type AnimatedFrames = {
  width: number;
  height: number;
  frames: WebPAnimationFrame[];
};

const NO_RESULT: SearchResult = { fitting: null, smallest: null };

export async function compressImage(
  file: File,
  maxSizeInBytes: number = IMAGE_MAX_SIZE,
): Promise<File> {
  if (file.size <= maxSizeInBytes) return file;

  const animated = await compressAnimatedImage(file, maxSizeInBytes);
  if (animated) return animated;

  try {
    const url = URL.createObjectURL(file);
    try {
      const image = await loadImage(url);
      const compressed = await compressStillImage(image, file, maxSizeInBytes);
      return compressed ?? file;
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch {
    return file;
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
    const naturalWidth =
      firstFrame.image.displayWidth || firstFrame.image.codedWidth;
    const naturalHeight =
      firstFrame.image.displayHeight || firstFrame.image.codedHeight;
    firstFrame.image.close();

    const scales = computeScales(naturalWidth, naturalHeight);
    const result = await searchScales(scales, (scale, start) =>
      encodeAnimatedAtScale(
        decoder,
        track.frameCount,
        naturalWidth,
        naturalHeight,
        scale,
        maxSizeInBytes,
        start,
      ),
    );

    const best = result.fitting ?? result.smallest;
    return best ? toFile(best, file.name, WEBP_MIME_TYPE, "webp") : null;
  } catch {
    return null;
  } finally {
    decoder.close();
  }
}

async function encodeAnimatedAtScale(
  decoder: ImageDecoder,
  frameCount: number,
  naturalWidth: number,
  naturalHeight: number,
  scale: number,
  maxSizeInBytes: number,
  start: SearchResult,
): Promise<SearchResult> {
  const extracted = await extractFrames(
    decoder,
    frameCount,
    naturalWidth,
    naturalHeight,
    scale,
  );
  if (!extracted) return start;
  const { width, height, frames } = extracted;

  return searchQualities(start, maxSizeInBytes, async (quality) => {
    const bytes = await encodeAnimation(
      width,
      height,
      true,
      frames.map((frame) => ({
        ...frame,
        config: { lossless: 0, quality: Math.round(quality * 100) },
      })),
    );
    return bytes
      ? { size: bytes.length, blob: new Blob([bytes.slice()]) }
      : null;
  });
}

async function extractFrames(
  decoder: ImageDecoder,
  frameCount: number,
  naturalWidth: number,
  naturalHeight: number,
  scale: number,
): Promise<AnimatedFrames | null> {
  const width = scaledSize(naturalWidth, scale);
  const height = scaledSize(naturalHeight, scale);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;
  canvas.width = width;
  canvas.height = height;

  const frameIndexes = Array.from({ length: frameCount }, (_, index) => index);
  const frames = await frameIndexes.reduce<Promise<WebPAnimationFrame[]>>(
    async (previous, frameIndex) => {
      const acc = await previous;
      const { image: videoFrame } = await decoder.decode({ frameIndex });
      context.clearRect(0, 0, width, height);
      context.drawImage(videoFrame, 0, 0, width, height);
      const { data } = context.getImageData(0, 0, width, height);
      const frame: WebPAnimationFrame = {
        data: new Uint8Array(data.buffer),
        duration: Math.max(
          MIN_FRAME_DURATION_MS,
          Math.round((videoFrame.duration ?? 0) / 1000),
        ),
      };
      videoFrame.close();
      return [...acc, frame];
    },
    Promise.resolve([]),
  );
  return { width, height, frames };
}

async function compressStillImage(
  image: HTMLImageElement,
  originalFile: File,
  maxSizeInBytes: number,
): Promise<File | null> {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return null;

  const mimeType = supportsWebP(canvas) ? WEBP_MIME_TYPE : JPEG_MIME_TYPE;
  const scales = computeScales(image.naturalWidth, image.naturalHeight);

  const result = await searchScales(scales, (scale, start) =>
    searchQualities(start, maxSizeInBytes, async (quality) => {
      const width = scaledSize(image.naturalWidth, scale);
      const height = scaledSize(image.naturalHeight, scale);
      canvas.width = width;
      canvas.height = height;
      drawImageOnCanvas(context, image, mimeType, width, height);
      const blob = await canvasToBlob(canvas, mimeType, quality);
      return blob ? { size: blob.size, blob } : null;
    }),
  );

  const best = result.fitting ?? result.smallest;
  const extension = mimeType === WEBP_MIME_TYPE ? "webp" : "jpg";
  return best ? toFile(best, originalFile.name, mimeType, extension) : null;
}

async function searchScales(
  scales: number[],
  encodeScale: (scale: number, start: SearchResult) => Promise<SearchResult>,
): Promise<SearchResult> {
  return scales.reduce<Promise<SearchResult>>(async (previous, scale) => {
    const acc = await previous;
    if (acc.fitting) return acc;
    return encodeScale(scale, acc);
  }, Promise.resolve(NO_RESULT));
}

async function searchQualities(
  start: SearchResult,
  maxSizeInBytes: number,
  encode: (quality: number) => Promise<Candidate | null>,
): Promise<SearchResult> {
  return QUALITIES.reduce<Promise<SearchResult>>(async (previous, quality) => {
    const acc = await previous;
    if (acc.fitting) return acc;
    const candidate = await encode(quality);
    if (!candidate) return acc;
    if (candidate.size <= maxSizeInBytes) {
      return { fitting: candidate, smallest: acc.smallest };
    }
    return {
      fitting: null,
      smallest: smallerCandidate(candidate, acc.smallest),
    };
  }, Promise.resolve(start));
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

async function loadImage(url: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = url;
  await image.decode();
  return image;
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

function scaledSize(natural: number, scale: number): number {
  return Math.max(1, Math.round(natural * scale));
}

function smallerCandidate(
  candidate: Candidate,
  current: Candidate | null,
): Candidate {
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

function toFile(
  candidate: Candidate,
  originalName: string,
  mimeType: string,
  extension: string,
): File {
  return new File(
    [candidate.blob],
    `${fileBaseName(originalName)}.${extension}`,
    { type: mimeType },
  );
}

function fileBaseName(name: string): string {
  return name.replace(/\.[^/.]+$/, "") || "avatar";
}
