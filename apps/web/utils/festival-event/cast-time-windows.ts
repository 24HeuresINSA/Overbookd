import { TimeWindow } from "@overbookd/festival-event";
import { HttpStringified } from "@overbookd/http";

export function castTimeWindowWithDate(
  timeWindow: HttpStringified<TimeWindow>,
): TimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}
