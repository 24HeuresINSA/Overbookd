import { Observable, filter } from "rxjs";

import type {
  PermissionGranted as PermissionGrantedEvent,
  PermissionRevoked as PermissionRevokedEvent,
  TeamLeft as TeamLeftEvent,
  TeamsJoined as TeamsJoinedEvent,
} from "@overbookd/access-manager";

import { CandidateEnrolled as CandidateEnrolledEvent } from "@overbookd/registration";
import type {
  FestivalActivityApprovedEvent,
  FestivalActivityCreatedEvent,
  FestivalActivityReadyToReviewEvent,
  FestivalActivityRejectedEvent,
} from "./festival-activity.js";
import {
  FestivalTaskApprovedEvent,
  FestivalTaskCreatedEvent,
  FestivalTaskReadyToReviewEvent,
  FestivalTaskRejectedEvent,
} from "./festival-task.js";
import {
  StaffRegisteredEvent,
  VolunteerRegisteredEvent,
} from "./registration.js";
import type { SharedMealClosedEvent } from "./shared-meal.js";

export type DomainEvent =
  | StaffRegisteredEvent
  | VolunteerRegisteredEvent
  | CandidateEnrolledEvent
  | FestivalActivityCreatedEvent
  | FestivalActivityReadyToReviewEvent
  | FestivalActivityApprovedEvent
  | FestivalActivityRejectedEvent
  | FestivalTaskCreatedEvent
  | FestivalTaskReadyToReviewEvent
  | FestivalTaskRejectedEvent
  | FestivalTaskApprovedEvent
  | SharedMealClosedEvent
  | PermissionGrantedEvent
  | PermissionRevokedEvent
  | TeamsJoinedEvent
  | TeamLeftEvent;

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
