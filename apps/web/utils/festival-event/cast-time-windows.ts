import { TimeWindow } from "@overbookd/festival-event";
import { HttpStringified } from "@overbookd/http";
import { WithAtLeastOneItem } from "@overbookd/list";

export function castTimeWindowWithDate(
  timeWindow: HttpStringified<TimeWindow>,
): TimeWindow {
  return {
    ...timeWindow,
    start: new Date(timeWindow.start),
    end: new Date(timeWindow.end),
  };
}

type WithTimeWindows = {
  timeWindows: WithAtLeastOneItem<TimeWindow>;
};
type WithStringifiedTimeWindows = HttpStringified<WithTimeWindows>;

export function withAtLeastOneTimeWindowWithDate<
  T extends WithStringifiedTimeWindows,
>(hasAtLeastOneTimeWindow: T): T & WithTimeWindows {
  const [timeWindow, ...others] = hasAtLeastOneTimeWindow.timeWindows;
  const first = castTimeWindowWithDate(timeWindow);
  const timeWindows: WithAtLeastOneItem<TimeWindow> = [
    first,
    ...others.map(castTimeWindowWithDate),
  ];

  return { ...hasAtLeastOneTimeWindow, timeWindows };
}
