import { Logger, OnApplicationBootstrap } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { DomainEvent } from "@overbookd/domain-events";
import { ENROLL_HARD, Permission } from "@overbookd/permission";
import { RegisterNewcomer } from "@overbookd/registration";
import { filter, merge, Observable } from "rxjs";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { DomainEventService } from "../domain-event/domain-event.service";

type PermissionBasedNotification = {
  source: Observable<DomainEvent>;
  permission: Permission;
};

export type NotificationRepository = {
  for(userId: number): Promise<Notifications>;
  readFrom(userId: number): Promise<void>;
};

export type Notifications = {
  hasNotifications: boolean;
};

type Identifiers = { teams: string[]; id: number };

export class NotificationService implements OnApplicationBootstrap {
  constructor(
    private readonly notifications: NotificationRepository,
    private readonly eventStore: DomainEventService,
    private readonly register: RegisterNewcomer,
    private readonly jwt: JwtService,
  ) {}

  private logger = new Logger("NotificationService");

  onApplicationBootstrap() {
    this.eventStore.staffsRegistered.subscribe(async ({ data: event }) => {
      this.logger.debug(JSON.stringify(event));
      const users = await this.register.notifyNewStaffAwaits(event);
      const notifyees = users.map(({ id }) => id);
      const logMessage = `Users ${notifyees} notified new staff await validation`;
      this.logger.log(logMessage);
    });
  }

  async hasNotifications(userId: number): Promise<Notifications> {
    return this.notifications.for(userId);
  }

  async readNotification(user: number): Promise<void> {
    await this.notifications.readFrom(user);
  }

  inLive(token: string): Observable<DomainEvent> {
    const { permissions, teams, id } = this.jwt.verify<JwtPayload>(token);

    return merge(
      ...this.myPermissionBasedNotifications(permissions),
      ...this.myAccessManagmentNotifications({ teams, id }),
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
