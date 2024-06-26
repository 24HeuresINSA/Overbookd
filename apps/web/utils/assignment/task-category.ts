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

export const TaskCategoryEmojis: Record<
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

export const TaskCategoryEmojiMap: Map<DisplayableCategory, TaskCategoryEmoji> =
  new Map([
    [STATIQUE, TaskCategoryEmojis.STATIQUE],
    [BAR, TaskCategoryEmojis.BAR],
    [MANUTENTION, TaskCategoryEmojis.MANUTENTION],
    [FUN, TaskCategoryEmojis.FUN],
    [RELOU, TaskCategoryEmojis.RELOU],
    ["AUCUNE", TaskCategoryEmojis.AUCUNE],
  ]);
