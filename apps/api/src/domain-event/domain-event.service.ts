import {
  PERMISSION_GRANTED,
  PERMISSION_REVOKED,
  PermissionGranted,
  PermissionRevoked,
  TEAM_LEFT,
  TeamLeft,
  TEAMS_JOINED,
  TeamsJoined,
} from "@overbookd/access-manager";
import {
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
  SHARED_MEAL_CLOSED,
  STAFF_REGISTERED,
  VOLUNTEER_REGISTERED,
  filterEvents,
  type FestivalActivityCreated,
  type FestivalActivityReadyToReview,
  type DomainEvent,
  FestivalActivityApproved,
  FestivalActivityRejected,
  StaffRegisteredEvent,
  VolunteerRegisteredEvent,
  SharedMealClosed,
} from "@overbookd/domain-events";
import { CANDIDATE_ENROLLED, CandidateEnrolled } from "@overbookd/registration";
import { SOFT_CODE } from "@overbookd/team-constants";
import { Observable, ReplaySubject, filter } from "rxjs";

type FestivalVolunteerEnrolled = CandidateEnrolled & {
  data: {
    team: typeof SOFT_CODE;
  };
};

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

  get staffsRegistered(): Observable<StaffRegisteredEvent> {
    return this.listen(STAFF_REGISTERED);
  }

  get volunteersRegistered(): Observable<VolunteerRegisteredEvent> {
    return this.listen(VOLUNTEER_REGISTERED);
  }

  get candidateEnrolled(): Observable<CandidateEnrolled> {
    return this.listen(CANDIDATE_ENROLLED);
  }

  get volunteersEnrolled(): Observable<FestivalVolunteerEnrolled> {
    return this.listen(CANDIDATE_ENROLLED).pipe(
      filter(isEnrollingFestivalVolunteer),
    );
  }

  get festivalActivityCreated(): Observable<FestivalActivityCreated> {
    return this.listen(FESTIVAL_ACTIVITY_CREATED);
  }

  get festivalActivityReadyToReview(): Observable<FestivalActivityReadyToReview> {
    return this.listen(FESTIVAL_ACTIVITY_READY_TO_REVIEW);
  }

  get festivalActivityApproved(): Observable<FestivalActivityApproved> {
    return this.listen(FESTIVAL_ACTIVITY_APPROVED);
  }

  get festivalActivityRejected(): Observable<FestivalActivityRejected> {
    return this.listen(FESTIVAL_ACTIVITY_REJECTED);
  }

  get festivalTaskCreated(): Observable<FestivalTaskCreated> {
    return this.listen(FESTIVAL_TASK_CREATED);
  }

  get festivalTaskReadyToReview(): Observable<FestivalTaskReadyToReview> {
    return this.listen(FESTIVAL_TASK_READY_TO_REVIEW);
  }

  get festivalTaskRejected(): Observable<FestivalTaskRejected> {
    return this.listen(FESTIVAL_TASK_REJECTED);
  }

  get festivalTaskApproved(): Observable<FestivalTaskApproved> {
    return this.listen(FESTIVAL_TASK_APPROVED);
  }

  get closedSharedMeal(): Observable<SharedMealClosed> {
    return this.listen(SHARED_MEAL_CLOSED);
  }

  get permissionGranted(): Observable<PermissionGranted> {
    return this.listen(PERMISSION_GRANTED);
  }

  get permissionRevoked(): Observable<PermissionRevoked> {
    return this.listen(PERMISSION_REVOKED);
  }

  get teamsJoined(): Observable<TeamsJoined> {
    return this.listen(TEAMS_JOINED);
  }

  get teamLeft(): Observable<TeamLeft> {
    return this.listen(TEAM_LEFT);
  }
}

function isEnrollingFestivalVolunteer(
  candidate: CandidateEnrolled,
): candidate is FestivalVolunteerEnrolled {
  return candidate.data.team === SOFT_CODE;
}
