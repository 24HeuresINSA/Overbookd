import type { BreakPeriod } from "@overbookd/assignment";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

export type BreakEvent = CalendarEvent & { kind: "break" };

export function toCalendarBreak(breakPeriod: BreakPeriod): BreakEvent {
  return createCalendarEvent({ ...breakPeriod, color: "black", kind: "break" });
}
