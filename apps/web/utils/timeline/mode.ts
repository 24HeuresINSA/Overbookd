export const TIMELINE = "timeline";
export const NEED_HELP = "need-help";

type TimelineMode = typeof TIMELINE | typeof NEED_HELP;

function getTimelineModeFromRoute(url: string): TimelineMode {
  const mode = url.split("/").at(-1);
  return mode == TIMELINE || mode == NEED_HELP ? mode : TIMELINE;
}

export function isTimelineMode(path: string): boolean {
  return getTimelineModeFromRoute(path) === TIMELINE;
}
