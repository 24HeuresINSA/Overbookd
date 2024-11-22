import {
  Approved,
  Created,
  FESTIVAL_ACTIVITY_APPROVED,
  FESTIVAL_ACTIVITY_CREATED,
  FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  FESTIVAL_ACTIVITY_REJECTED,
  FESTIVAL_TASK_APPROVED,
  FESTIVAL_TASK_CREATED,
  FESTIVAL_TASK_READY_TO_REVIEW,
  FESTIVAL_TASK_REJECTED,
  FestivalTaskApproved,
  FestivalTaskCreated,
  FestivalTaskReadyToReview,
  FestivalTaskRejected,
  ReadyToReview,
  Rejected,
  SHARED_MEAL_CLOSED,
  STAFF_REGISTERED,
  VOLUNTEER_REGISTERED,
  filterEvents,
  type DomainEvent,
} from "@overbookd/domain-events";
import { PastSharedMeal } from "@overbookd/personal-account";
import {
  CANDIDATE_ENROLLED,
  CandidateEnrolled,
  StaffRegistered,
  VolunteerRegistered,
} from "@overbookd/registration";
import { SOFT_CODE } from "@overbookd/team-constants";
import { Observable, ReplaySubject, filter, map } from "rxjs";

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

  get volunteersEnrolled(): Observable<CandidateEnrolled> {
    return this.listen(CANDIDATE_ENROLLED).pipe(
      filter(({ data }) => data.team === SOFT_CODE),
    );
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
