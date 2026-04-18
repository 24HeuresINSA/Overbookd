import {
  BAR,
  type Category,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
  COLLAGE,
  taskCategories,
} from "@overbookd/festival-event-constants";

export const AUCUNE = "AUCUNE";

export const displayableCategories = [...taskCategories, AUCUNE] as const;

export type DisplayableCategory = Category | typeof AUCUNE;

export type TaskCategoryEmoji = "🥶" | "🍻" | "👷" | "😂" | "🥱" | "🩹" | "🤷‍♂️";

export const taskCategoryEmojis: Record<
  DisplayableCategory,
  TaskCategoryEmoji
> = {
  STATIQUE: "🥶",
  BAR: "🍻",
  MANUTENTION: "👷",
  FUN: "😂",
  RELOU: "🥱",
  COLLAGE: "🩹",
  AUCUNE: "🤷‍♂️",
};

export const taskCategoryEmojiMap: Map<DisplayableCategory, TaskCategoryEmoji> =
  new Map([
    [STATIQUE, taskCategoryEmojis.STATIQUE],
    [BAR, taskCategoryEmojis.BAR],
    [MANUTENTION, taskCategoryEmojis.MANUTENTION],
    [FUN, taskCategoryEmojis.FUN],
    [RELOU, taskCategoryEmojis.RELOU],
    [COLLAGE, taskCategoryEmojis.COLLAGE],
    [AUCUNE, taskCategoryEmojis.AUCUNE],
  ]);

export function getStatCategoryEmoji(
  category: DisplayableCategory | null,
): string {
  if (category === null) return taskCategoryEmojis.AUCUNE;
  return taskCategoryEmojiMap.get(category) ?? taskCategoryEmojis.AUCUNE;
}

export function getStatCategoryName(
  category: DisplayableCategory | null,
): string {
  return capitalizeFirstLetter(category?.toLowerCase() ?? "indeterminé");
}
