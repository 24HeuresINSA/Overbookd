import { Logger, OnApplicationBootstrap } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { Observable, filter, merge } from "rxjs";
import { RegisterNewcomer } from "@overbookd/registration";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { ENROLL_HARD, Permission } from "@overbookd/permission";
import { STAFF_REGISTERED, DomainEvent } from "@overbookd/domain-events";
import { PERMISSION_GRANTED } from "@overbookd/access-manager";

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

export class NotificationService implements OnApplicationBootstrap {
  constructor(
    private readonly notifications: NotificationRepository,
    private readonly eventStore: DomainEventService,
    private readonly register: RegisterNewcomer,
    private readonly jwt: JwtService,
  ) {}

  private logger = new Logger("NotificationService");

  onApplicationBootstrap() {
    this.eventStore.staffsRegistered.subscribe(async (event) => {
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
    const { permissions, teams } = this.jwt.verify<JwtPayload>(token);

    return merge(
      ...this.myPermissionBasedNotifictations(permissions),
      this.myAccessManagmentNotifications(teams),
    );
  }

  private myAccessManagmentNotifications(teams: string[]) {
    return this.permissionGranted.pipe(
      filter(({ data: { to } }) => teams.includes(to)),
    );
  }

  private myPermissionBasedNotifictations(
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
    const staffRegistered = this.eventStore.listen(STAFF_REGISTERED);
    return { source: staffRegistered, permission: ENROLL_HARD };
  }

  private get permissionGranted() {
    return this.eventStore.listen(PERMISSION_GRANTED);
  }
}
