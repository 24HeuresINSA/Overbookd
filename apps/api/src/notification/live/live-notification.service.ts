import { JwtService } from "@nestjs/jwt";
import { type DomainEvent } from "@overbookd/domain-events";
import { ENROLL_HARD, type Permission } from "@overbookd/permission";
import { filter, merge, Observable } from "rxjs";
import { JwtPayload } from "../../authentication/entities/jwt-util.entity";
import { DomainEventService } from "../../domain-event/domain-event.service";

type Identifiers = { teams: string[]; id: number };

type PermissionBasedNotification = {
  source: Observable<DomainEvent>;
  permission: Permission;
};

export class LiveNotificationService {
  constructor(
    private readonly eventStore: DomainEventService,
    private readonly jwt: JwtService,
  ) {}

  mine(token: string): Observable<DomainEvent> {
    const { permissions, teams, id } = this.jwt.verify<JwtPayload>(token);

    return merge(
      ...this.myPermissionBasedNotifications(permissions),
      ...this.myAccessManagmentNotifications({ teams, id }),
      ...this.myFestivalActivityNotifications(id),
    );
  }

  festivalActivities(): Observable<DomainEvent> {
    return merge(
      this.eventStore.festivalActivityCreated,
      this.eventStore.festivalActivityReadyToReview,
      this.eventStore.festivalActivityRejected,
      this.eventStore.festivalActivityApproved,
    );
  }

  private myAccessManagmentNotifications(
    identifiers: Identifiers,
  ): Observable<DomainEvent>[] {
    const { teams, id } = identifiers;
    return [
      this.eventStore.permissionGranted.pipe(
        filter(({ data: { to } }) => teams.includes(to)),
      ),
      this.eventStore.permissionRevoked.pipe(
        filter(({ data: { from } }) => teams.includes(from)),
      ),
      this.eventStore.teamsJoined.pipe(
        filter(({ data: { member } }) => member.id === id),
      ),
      this.eventStore.teamLeft.pipe(
        filter(({ data: { member } }) => member.id === id),
      ),
      this.eventStore.candidateEnrolled.pipe(
        filter(({ data: { candidate } }) => candidate.id === id),
      ),
    ];
  }

  private myFestivalActivityNotifications(
    userId: number,
  ): Observable<DomainEvent>[] {
    return [
      this.eventStore.festivalActivityRejected.pipe(
        filter(({ data: { festivalActivity } }) => {
          return festivalActivity.inCharge.adherent.id === userId;
        }),
      ),
      this.eventStore.festivalActivityReadyToReview.pipe(
        filter(({ data: { festivalActivity } }) => {
          return festivalActivity.inCharge.adherent.id === userId;
        }),
      ),
    ];
  }

  private myPermissionBasedNotifications(
    permissions: Permission[],
  ): Observable<DomainEvent>[] {
    const permissionBasedNotifications: PermissionBasedNotification[] = [
      this.staffRegistered,
    ];

    return permissionBasedNotifications
      .filter(({ permission }) => permissions.includes(permission))
      .map(({ source }) => source);
  }

  private get staffRegistered(): PermissionBasedNotification {
    const staffRegistered = this.eventStore.staffsRegistered;
    return { source: staffRegistered, permission: ENROLL_HARD };
  }
}
