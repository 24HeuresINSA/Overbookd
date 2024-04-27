import { AssignmentIdentifier } from "@overbookd/assignment";
import { CalendarEvent, DailyEvent } from "../models/calendar.model";

export function isDailyEvent(
  event: AssignmentIdentifier | DailyEvent,
): event is DailyEvent {
  return (event as DailyEvent).timed === false;
}

export type CalendarEventWithIdentifier = CalendarEvent & {
  identifier: AssignmentIdentifier;
};

export function isWithIdentifier(
  event: CalendarEventWithIdentifier | CalendarEvent,
): event is CalendarEventWithIdentifier {
  return Object.hasOwn(event, "identifier");
}
