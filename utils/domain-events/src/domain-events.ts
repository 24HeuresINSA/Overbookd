import type {
  AdherentRegisteredEvent,
  VolunteerRegisteredEvent,
} from "@overbookd/registration";
import { Observable, filter } from "rxjs";
import {
  FestivalActivityCreatedEvent,
  FestivalActivityApprovedEvent,
  FestivalActivityReadyToReviewEvent,
  FestivalActivityRejectedEvent,
} from "./festival-activity";

export type DomainEvent =
  | AdherentRegisteredEvent
  | VolunteerRegisteredEvent
  | FestivalActivityCreatedEvent
  | FestivalActivityReadyToReviewEvent
  | FestivalActivityApprovedEvent
  | FestivalActivityRejectedEvent;

export function filterEvents<T extends DomainEvent["type"]>(
  type: T,
  $domainEvent: Observable<DomainEvent>,
): Observable<Extract<DomainEvent, { type: T }>> {
  return $domainEvent.pipe(
    filter(
      (event): event is Extract<DomainEvent, { type: T }> =>
        event.type === type,
    ),
  );
}

export function addEventListener<T extends DomainEvent["type"]>(
  eventSource: EventSource,
  type: T,
  handler: (
    event: MessageEvent<unknown> & Extract<DomainEvent, { type: T }>,
  ) => void,
) {
  eventSource.addEventListener(
    type,
    handler as EventListenerOrEventListenerObject,
  );
}
