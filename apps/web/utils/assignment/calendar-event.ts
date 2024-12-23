import type { AssignmentIdentifier } from "@overbookd/assignment";
import type { CalendarEvent } from "../calendar/event";

export type CalendarEventWithIdentifier = CalendarEvent & {
  identifier: AssignmentIdentifier;
};

export function hasAssignmentIdentifier(
  event: CalendarEventWithIdentifier | CalendarEvent,
): event is CalendarEventWithIdentifier {
  return Object.hasOwn(event, "identifier");
}
