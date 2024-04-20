import { Category, categories } from "@overbookd/festival-event-constants";

export const AUCUNE = "AUCUNE";

export const displayableCategories = [...categories, AUCUNE] as const;

export type DisplayableCategory = Category | typeof AUCUNE;
