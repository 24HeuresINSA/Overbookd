import type { BreakPeriod } from "@overbookd/assignment";
import {
  createCalendarEvent,
  type CalendarEvent,
} from "~/utils/calendar/event";

const BREAK = "break";
export type BreakEvent = CalendarEvent & { kind: typeof BREAK };

export function toCalendarBreak(breakPeriod: BreakPeriod): BreakEvent {
  return createCalendarEvent({ ...breakPeriod, color: "black", kind: BREAK });
}

export function isBreakEvent(event: CalendarEvent): event is BreakEvent {
  return "kind" in event && event.kind === BREAK;
}
