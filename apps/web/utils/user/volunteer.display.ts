import { stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";

export const TROMBINOSCOPE = "trombinoscope";
export const VOLUNTEER_LIST = "volunteer-list";
export const VOLUNTEER_STATS = "volunteer-stats";

const DISPLAY_MODES = [TROMBINOSCOPE, VOLUNTEER_LIST, VOLUNTEER_STATS] as const;

export type DisplayMode = (typeof DISPLAY_MODES)[number];

export class DisplayModeBuilder {
  static getFromRouteQuery(query: LocationQuery): DisplayMode {
    const displayMode = stringifyQueryParam(query.displayMode);
    return isDisplayMode(displayMode) ? displayMode : TROMBINOSCOPE;
  }
}

export function isDisplayMode(value: string): value is DisplayMode {
  return DISPLAY_MODES.includes(value as DisplayMode);
}
