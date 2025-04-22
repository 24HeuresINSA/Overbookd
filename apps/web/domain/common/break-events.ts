import type { IProvidePeriod } from "@overbookd/time";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

export const PAUSE = "Pause";

export type BreakEvent = CalendarEvent & { kind: "break" };

const BREAK = { name: PAUSE, color: "black", kind: "break" } as const;

export function convertToCalendarBreak(period: IProvidePeriod): BreakEvent {
  const { start, end } = period;
  return createCalendarEvent({ start, end, ...BREAK });
}
