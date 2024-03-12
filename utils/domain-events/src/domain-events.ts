import { Observable, filter } from "rxjs";

import type {
  FestivalActivityCreatedEvent,
  FestivalActivityApprovedEvent,
  FestivalActivityReadyToReviewEvent,
  FestivalActivityRejectedEvent,
} from "./festival-activity";
import type { SharedMealClosedEvent } from "./shared-meal";
import {
  FestivalTaskApprovedEvent,
  FestivalTaskCreatedEvent,
  FestivalTaskReadyToReviewEvent,
  FestivalTaskRejectedEvent,
} from "./festival-task";
import { StaffRegisteredEvent, VolunteerRegisteredEvent } from "./registration";

export type DomainEvent =
  | StaffRegisteredEvent
  | VolunteerRegisteredEvent
  | FestivalActivityCreatedEvent
  | FestivalActivityReadyToReviewEvent
  | FestivalActivityApprovedEvent
  | FestivalActivityRejectedEvent
  | FestivalTaskCreatedEvent
  | FestivalTaskReadyToReviewEvent
  | FestivalTaskRejectedEvent
  | FestivalTaskApprovedEvent
  | SharedMealClosedEvent;

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
