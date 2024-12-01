import { Observable, filter } from "rxjs";

import type {
  PermissionGranted as PermissionGrantedEvent,
  PermissionRevoked as PermissionRevokedEvent,
  TeamLeft as TeamLeftEvent,
  TeamsJoined as TeamsJoinedEvent,
} from "@overbookd/access-manager";

import { CandidateEnrolled as CandidateEnrolledEvent } from "@overbookd/registration";
import type {
  FestivalActivityApproved,
  FestivalActivityCreated,
  FestivalActivityReadyToReview,
  FestivalActivityRejected,
} from "./festival-activity.js";
import {
  FestivalTaskApproved,
  FestivalTaskCreated,
  FestivalTaskReadyToReview,
  FestivalTaskRejected,
} from "./festival-task.js";
import {
  StaffRegisteredEvent,
  VolunteerRegisteredEvent,
} from "./registration.js";
import type { SharedMealClosed } from "./shared-meal.js";

export type DomainEvent =
  | StaffRegisteredEvent
  | VolunteerRegisteredEvent
  | CandidateEnrolledEvent
  | FestivalActivityCreated
  | FestivalActivityReadyToReview
  | FestivalActivityApproved
  | FestivalActivityRejected
  | FestivalTaskCreated
  | FestivalTaskReadyToReview
  | FestivalTaskRejected
  | FestivalTaskApproved
  | SharedMealClosed
  | PermissionGrantedEvent
  | PermissionRevokedEvent
  | TeamsJoinedEvent
  | TeamLeftEvent;

export type EventOf<T extends DomainEvent["type"]> = Extract<
  DomainEvent,
  { type: T }
>;

type DomainEventMessage<T extends DomainEvent["type"]> = MessageEvent<unknown> &
  EventOf<T>;

export function filterEvents<T extends DomainEvent["type"]>(
  type: T,
  $domainEvent: Observable<DomainEvent>,
): Observable<EventOf<T>> {
  return $domainEvent.pipe(
    filter((event): event is EventOf<T> => event.type === type),
  );
}

export type HandleEvent<T extends DomainEvent["type"]> = (
  event: DomainEventMessage<T>,
) => void;

export function addEventListener<T extends DomainEvent["type"]>(
  eventSource: EventSource,
  type: T,
  handler: HandleEvent<T>,
) {
  const parseAndHandle = ((event: EventOf<T> & MessageEvent<string>) => {
    const data: EventOf<T> = JSON.parse(event.data);
    handler({ ...event, data });
  }) as EventListenerOrEventListenerObject;

  eventSource.addEventListener(type, parseAndHandle);
}
