import type { IProvidePeriod } from "@overbookd/time";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

export const PAUSE = "Pause";

export function convertToCalendarBreak({
  start,
  end,
}: IProvidePeriod): CalendarEvent {
  return createCalendarEvent({ start, end, name: PAUSE, color: "black" });
}
