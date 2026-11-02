import { updateItemToList } from "@overbookd/list";

type PreviewWithId = { id: number };

export function replaceExistingPreview<T extends PreviewWithId>(
  previews: T[],
  preview: T,
): T[] {
  const index = previews.findIndex(({ id }) => id === preview.id);
  if (index === -1) return previews;
  return updateItemToList(previews, index, preview);
}
