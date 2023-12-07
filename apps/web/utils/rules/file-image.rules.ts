function isImage(value?: File | null): string | boolean {
  const message = "Une photo vide n'est pas une photo";
  return !!value || message;
}

function isImageSizeWithinLimit(value?: File | null): string | boolean {
  const MAX_SIZE = 1024 * 1024 * 2;
  const message = "Moins de 2 Mo s'il vous plaît 🙏";
  return (value?.size ?? 0) < MAX_SIZE || message;
}

function isSupportedImageFile(value?: File | null): string | boolean {
  const extensions = ["image/png", "image/jpeg", "image/gif"];
  const message = "Seulement des images (png, jpeg ou gif)";
  const isSupportedFile = !!value && extensions.includes(value.type);
  return isSupportedFile || message;
}

export const imageRules = [
  isImage,
  isImageSizeWithinLimit,
  isSupportedImageFile,
];

export function isImageValid(value?: File | null): boolean {
  return imageRules.every((rule) => rule(value) === true);
}
