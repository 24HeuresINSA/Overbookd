import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";

export const TROMBINOSCOPE = "trombinoscope";
export const VOLUNTEER_LIST = "volunteer-list";
export const VOLUNTEER_STATS = "volunteer-stats";

const DISPLAY_MODES = [TROMBINOSCOPE, VOLUNTEER_LIST, VOLUNTEER_STATS] as const;
const DISPLAY_MODE_STORAGE_KEY = "last-volunteers-display-view";

export type DisplayMode = (typeof DISPLAY_MODES)[number];

export class DisplayModeBuilder {
  static getFromRouteQuery(query: LocationQuery): DisplayMode {
    const urlMode = stringifyQueryParam(query.displayMode);
    if (isDisplayMode(urlMode)) return urlMode;
    const savedMode = localStorage.getItem(DISPLAY_MODE_STORAGE_KEY);
    return savedMode && isDisplayMode(savedMode) ? savedMode : TROMBINOSCOPE;
  }

  static saveToStorage(displayMode: DisplayMode) {
    localStorage.setItem(DISPLAY_MODE_STORAGE_KEY, displayMode);
  }
}

export function isDisplayMode(value: string): value is DisplayMode {
  return DISPLAY_MODES.includes(value as DisplayMode);
}
