import { afterEach, describe, expect, it, vi } from "vitest";
import {
  GIF_MIME_TYPE,
  IMAGE_MAX_SIZE,
  JPEG_MIME_TYPE,
  WEBP_MIME_TYPE,
} from "@overbookd/http";
import { compressImage } from "./image.utils";

const BASE_BLOB_SIZE = 1_000_000;
const FAKE_FRAME_DURATION_US = 100_000;
const FAKE_FRAME_WIDTH = 4000;
const FAKE_FRAME_HEIGHT = 3000;

type CanvasCalls = {
  toBlob: Array<{ mimeType: string; quality: number }>;
  drawImage: unknown[][];
  fillRectCount: number;
};

class FakeImage {
  naturalWidth = FAKE_FRAME_WIDTH;
  naturalHeight = FAKE_FRAME_HEIGHT;
  src = "";
  decode() {
    return Promise.resolve();
  }
}

class FakeVideoFrame {
  duration = FAKE_FRAME_DURATION_US;
  displayWidth = FAKE_FRAME_WIDTH;
  displayHeight = FAKE_FRAME_HEIGHT;
  close() {}
}

class FakeImageDecoder {
  static frameCount = 3;
  tracks = {
    ready: Promise.resolve(),
    length: 1,
    0: { frameCount: FakeImageDecoder.frameCount },
  };
  async decode() {
    return { image: new FakeVideoFrame(), complete: true };
  }
  close() {}
}

function makeFile(size: number, name = "photo.png", type = "image/png"): File {
  return new File([new Uint8Array(size)], name, { type });
}

function setupFakeCanvas(webpSupported: boolean): CanvasCalls {
  const calls: CanvasCalls = { toBlob: [], drawImage: [], fillRectCount: 0 };

  vi.stubGlobal("Image", FakeImage);
  vi.stubGlobal("document", {
    createElement: (tag: string) =>
      tag === "canvas"
        ? {
            width: 0,
            height: 0,
            getContext: () => ({
              fillStyle: "",
              fillRect: () => {
                calls.fillRectCount += 1;
              },
              clearRect: () => {},
              drawImage: (...args: unknown[]) => {
                calls.drawImage.push(args);
              },
              getImageData: (_x: number, _y: number, w: number, h: number) => ({
                data: new Uint8ClampedArray(w * h * 4),
              }),
            }),
            toBlob: (
              callback: (blob: Blob | null) => void,
              mimeType: string,
              quality: number,
            ) => {
              calls.toBlob.push({ mimeType, quality });
              const size = Math.round(BASE_BLOB_SIZE * quality);
              callback(new Blob([new Uint8Array(size)], { type: mimeType }));
            },
            toDataURL: (mimeType: string) =>
              webpSupported && mimeType === WEBP_MIME_TYPE
                ? `data:${WEBP_MIME_TYPE};base64,fake`
                : "data:image/png;base64,fake",
          }
        : {},
  });
  URL.createObjectURL = vi.fn(() => "blob:fake-url");
  URL.revokeObjectURL = vi.fn();

  return calls;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("compressImage", () => {
  it("returns the original file when it already fits under the limit", async () => {
    const calls = setupFakeCanvas(true);
    const file = makeFile(IMAGE_MAX_SIZE - 1);
    const result = await compressImage(file, IMAGE_MAX_SIZE);
    expect(result).toBe(file);
    expect(calls.toBlob).toEqual([]);
  });

  it("compresses an oversized image under the limit as webp", async () => {
    const calls = setupFakeCanvas(true);
    const result = await compressImage(
      makeFile(5 * 1024 * 1024),
      IMAGE_MAX_SIZE,
    );

    expect(result.size).toBeLessThanOrEqual(IMAGE_MAX_SIZE);
    expect(result.type).toBe(WEBP_MIME_TYPE);
    expect(result.name).toBe("photo.webp");
    expect(calls.toBlob.map((call) => call.quality)).toEqual([
      0.9, 0.8, 0.7, 0.6, 0.5,
    ]);
    expect(calls.drawImage[0]?.slice(1)).toEqual([0, 0, 2048, 1536]);
  });

  it("falls back to the smallest blob when nothing fits under the limit", async () => {
    setupFakeCanvas(true);
    const result = await compressImage(makeFile(5 * 1024 * 1024), 100);
    expect(result.size).toBe(Math.round(BASE_BLOB_SIZE * 0.1));
    expect(result.type).toBe(WEBP_MIME_TYPE);
  });

  it("encodes as jpeg with a white background when webp is not supported", async () => {
    const calls = setupFakeCanvas(false);
    const result = await compressImage(
      makeFile(5 * 1024 * 1024, "avatar.jpeg", JPEG_MIME_TYPE),
      IMAGE_MAX_SIZE,
    );

    expect(result.type).toBe(JPEG_MIME_TYPE);
    expect(result.name).toBe("avatar.jpg");
    expect(calls.fillRectCount).toBeGreaterThan(0);
    expect(calls.toBlob[0]?.mimeType).toBe(JPEG_MIME_TYPE);
  });

  it("keeps an animated gif animated by re-encoding every frame as gif", async () => {
    vi.stubGlobal("ImageDecoder", FakeImageDecoder);
    FakeImageDecoder.frameCount = 3;
    const calls = setupFakeCanvas(true);
    const result = await compressImage(
      makeFile(5 * 1024 * 1024, "animation.gif", GIF_MIME_TYPE),
      IMAGE_MAX_SIZE,
    );

    expect(result.type).toBe(GIF_MIME_TYPE);
    expect(result.name).toBe("animation.gif");
    expect(result.size).toBeLessThanOrEqual(IMAGE_MAX_SIZE);
    expect(await result.slice(0, 6).text()).toBe("GIF89a");
    expect(calls.drawImage).toHaveLength(3);
    expect(calls.toBlob).toEqual([]);
  });

  it("keeps an animated webp animated by re-encoding it as gif", async () => {
    vi.stubGlobal("ImageDecoder", FakeImageDecoder);
    FakeImageDecoder.frameCount = 2;
    setupFakeCanvas(true);
    const result = await compressImage(
      makeFile(5 * 1024 * 1024, "animation.webp", WEBP_MIME_TYPE),
      IMAGE_MAX_SIZE,
    );

    expect(result.type).toBe(GIF_MIME_TYPE);
    expect(result.name).toBe("animation.gif");
    expect(await result.slice(0, 6).text()).toBe("GIF89a");
  });

  it("uses the static path when the image has a single frame", async () => {
    vi.stubGlobal("ImageDecoder", FakeImageDecoder);
    FakeImageDecoder.frameCount = 1;
    const calls = setupFakeCanvas(true);
    const result = await compressImage(
      makeFile(5 * 1024 * 1024, "static.webp", WEBP_MIME_TYPE),
      IMAGE_MAX_SIZE,
    );

    expect(result.type).toBe(WEBP_MIME_TYPE);
    expect(result.name).toBe("static.webp");
    expect(calls.toBlob.length).toBeGreaterThan(0);
  });

  it("returns the original animated file when it already fits under the limit", async () => {
    vi.stubGlobal("ImageDecoder", FakeImageDecoder);
    const file = makeFile(IMAGE_MAX_SIZE - 1, "animation.gif", GIF_MIME_TYPE);
    const result = await compressImage(file, IMAGE_MAX_SIZE);
    expect(result).toBe(file);
  });
});
