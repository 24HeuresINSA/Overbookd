import { HttpStringified } from "../types/http";
import { IProvidePeriod } from "@overbookd/period";

export function castTimeWindowWithDate(
  timeWindow: HttpStringified<IProvidePeriod>,
): IProvidePeriod {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}
