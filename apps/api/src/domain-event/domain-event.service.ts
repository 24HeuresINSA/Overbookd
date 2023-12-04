import { Observable, ReplaySubject, map } from "rxjs";
import {
  filterEvents,
  type DomainEvent,
  FESTIVAL_ACTIVITY_CREATED,
  FESTIVAL_ACTIVITY_APPROVED,
  FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  FESTIVAL_ACTIVITY_REJECTED,
} from "@overbookd/domain-events";
import {
  ADHERENT_REGISTERED,
  AdherentRegistered,
  VOLUNTEER_REGISTERED,
  VolunteerRegistered,
} from "@overbookd/registration";
import {
  Approved,
  Created,
  ReadyToReview,
  Rejected,
} from "@overbookd/festival-activity";

export class DomainEventService {
  private readonly $events = new ReplaySubject<DomainEvent>();

  private constructor(events: DomainEvent[]) {
    events.forEach((event) => this.$events.next(event));
  }

  static withEvents(events: DomainEvent[]): DomainEventService {
    return new DomainEventService(events);
  }

  static init(): DomainEventService {
    return new DomainEventService([]);
  }

  listen<T extends DomainEvent["type"]>(
    domain: T,
  ): Observable<Extract<DomainEvent, { type: T }>> {
    return filterEvents(domain, this.$events);
  }

  publish(event: DomainEvent): void {
    this.$events.next(event);
  }

  get adherentsRegistered(): Observable<AdherentRegistered> {
    return this.listen(ADHERENT_REGISTERED).pipe(map(({ data }) => data));
  }

  get volunteersRegistered(): Observable<VolunteerRegistered> {
    return this.listen(VOLUNTEER_REGISTERED).pipe(map(({ data }) => data));
  }

  get createdFestivalActivity(): Observable<Created> {
    return this.listen(FESTIVAL_ACTIVITY_CREATED).pipe(map(({ data }) => data));
  }

  get readyToReviewFestivalActivity(): Observable<ReadyToReview> {
    return this.listen(FESTIVAL_ACTIVITY_READY_TO_REVIEW).pipe(
      map(({ data }) => data),
    );
  }

  get approvedFestivalActivity(): Observable<Approved> {
    return this.listen(FESTIVAL_ACTIVITY_APPROVED).pipe(
      map(({ data }) => data),
    );
  }

  get rejectedFestivalActivity(): Observable<Rejected> {
    return this.listen(FESTIVAL_ACTIVITY_REJECTED).pipe(
      map(({ data }) => data),
    );
  }
}
