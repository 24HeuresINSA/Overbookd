import {
  BAR,
  type Category,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
  categories,
} from "@overbookd/festival-event-constants";

export const AUCUNE = "AUCUNE";

export const displayableCategories = [...categories, AUCUNE] as const;

export type DisplayableCategory = Category | typeof AUCUNE;

export type TaskCategoryEmoji = "🥶" | "🍻" | "👷" | "😂" | "🥱" | "🤷‍♂️";

export const taskCategoryEmojis: Record<
  DisplayableCategory,
  TaskCategoryEmoji
> = {
  STATIQUE: "🥶",
  BAR: "🍻",
  MANUTENTION: "👷",
  FUN: "😂",
  RELOU: "🥱",
  AUCUNE: "🤷‍♂️",
};

export const taskCategoryEmojiMap: Map<DisplayableCategory, TaskCategoryEmoji> =
  new Map([
    [STATIQUE, taskCategoryEmojis.STATIQUE],
    [BAR, taskCategoryEmojis.BAR],
    [MANUTENTION, taskCategoryEmojis.MANUTENTION],
    [FUN, taskCategoryEmojis.FUN],
    [RELOU, taskCategoryEmojis.RELOU],
    ["AUCUNE", taskCategoryEmojis.AUCUNE],
  ]);
