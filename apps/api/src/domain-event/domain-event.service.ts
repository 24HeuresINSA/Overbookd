import { Observable, ReplaySubject, map } from "rxjs";
import {
  filterEvents,
  type DomainEvent,
  FESTIVAL_ACTIVITY_CREATED,
  FESTIVAL_ACTIVITY_APPROVED,
  FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  FESTIVAL_ACTIVITY_REJECTED,
  Approved,
  Created,
  ReadyToReview,
  Rejected,
  SHARED_MEAL_CLOSED,
  FestivalTaskCreated,
  FESTIVAL_TASK_CREATED,
  FESTIVAL_TASK_READY_TO_REVIEW,
  FestivalTaskReadyToReview,
  FestivalTaskRejected,
  FESTIVAL_TASK_REJECTED,
  FestivalTaskApproved,
  FESTIVAL_TASK_APPROVED,
  STAFF_REGISTERED,
  VOLUNTEER_REGISTERED,
  VOLUNTEER_ENROLLED,
} from "@overbookd/domain-events";
import {
  EnrolledNewcomer,
  StaffRegistered,
  VolunteerRegistered,
} from "@overbookd/registration";
import { PastSharedMeal } from "@overbookd/personal-account";

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

  get staffsRegistered(): Observable<StaffRegistered> {
    return this.listen(STAFF_REGISTERED).pipe(map(({ data }) => data));
  }

  get volunteersRegistered(): Observable<VolunteerRegistered> {
    return this.listen(VOLUNTEER_REGISTERED).pipe(map(({ data }) => data));
  }

  get volunteersEnrolled(): Observable<EnrolledNewcomer> {
    return this.listen(VOLUNTEER_ENROLLED).pipe(map(({ data }) => data));
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

  get createdFestivalTask(): Observable<FestivalTaskCreated> {
    return this.listen(FESTIVAL_TASK_CREATED).pipe(map(({ data }) => data));
  }

  get readyToReviewFestivalTask(): Observable<FestivalTaskReadyToReview> {
    return this.listen(FESTIVAL_TASK_READY_TO_REVIEW).pipe(
      map(({ data }) => data),
    );
  }

  get rejectedFestivalTask(): Observable<FestivalTaskRejected> {
    return this.listen(FESTIVAL_TASK_REJECTED).pipe(map(({ data }) => data));
  }

  get approvedFestivalTask(): Observable<FestivalTaskApproved> {
    return this.listen(FESTIVAL_TASK_APPROVED).pipe(map(({ data }) => data));
  }

  get closedSharedMeal(): Observable<PastSharedMeal> {
    return this.listen(SHARED_MEAL_CLOSED).pipe(map(({ data }) => data));
  }
}
