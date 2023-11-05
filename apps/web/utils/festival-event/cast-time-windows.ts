import { TimeWindow } from "@overbookd/festival-activity";
import { HttpStringified } from "../types/http";

export function castTimeWindowWithDate(
  timeWindow: HttpStringified<TimeWindow>,
): TimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}
