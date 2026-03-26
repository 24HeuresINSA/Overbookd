import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";

export const DISPLAY_FA = "fa";
export const DISPLAY_FT = "ft";

const DISPLAY_MODES = [DISPLAY_FA, DISPLAY_FT] as const;
const DISPLAY_MODE_STORAGE_KEY = "last-stats-display-view";

export type StatsDisplayMode = (typeof DISPLAY_MODES)[number];

export class StatsDisplayModeBuilder {
  static getFromRouteQuery(query: LocationQuery): StatsDisplayMode {
    const urlMode = stringifyQueryParam(query.displayMode);
    if (isStatsDisplayMode(urlMode)) return urlMode;
    const savedMode = localStorage.getItem(DISPLAY_MODE_STORAGE_KEY);
    return savedMode && isStatsDisplayMode(savedMode) ? savedMode : DISPLAY_FA;
  }

  static saveToStorage(displayMode: StatsDisplayMode) {
    localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, displayMode);
  }
}

export function isStatsDisplayMode(value: string): value is StatsDisplayMode {
  return DISPLAY_MODES.includes(value as StatsDisplayMode);
}
