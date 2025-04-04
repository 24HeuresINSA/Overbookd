import type { VDataTable } from "vuetify/components";

export type TableHeaders = VDataTable["$props"]["headers"];

export type Density = "compact" | "comfortable" | "default";

export const DEFAULT_ITEMS_PER_PAGE = 25;
