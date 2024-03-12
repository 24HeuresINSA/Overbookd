import { Logger, OnApplicationBootstrap } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { Observable, merge } from "rxjs";
import { RegisterNewcomer } from "@overbookd/registration";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { ENROLL_HARD, Permission } from "@overbookd/permission";
import { STAFF_REGISTERED, DomainEvent } from "@overbookd/domain-events";

type AvailableNotification = {
  source: Observable<DomainEvent>;
  permission: Permission;
};

export interface NotificationRepository {
  for(userId: number): Promise<Notifications>;
  readFrom(userId: number): Promise<void>;
}

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
    const { permissions } = this.jwt.verify<JwtPayload>(token);

    const myNotifications = this.filterMyNotifications(permissions);
    return merge(...myNotifications);
  }

  private filterMyNotifications(
    permissions: Permission[],
  ): Observable<DomainEvent>[] {
    const availableNotifications: AvailableNotification[] = [
      this.staffRegistered,
    ];

    return availableNotifications
      .filter(({ permission }) => permissions.includes(permission))
      .map(({ source }) => source);
  }

  private get staffRegistered(): AvailableNotification {
    const staffRegistered = this.eventStore.listen(STAFF_REGISTERED);
    return { source: staffRegistered, permission: ENROLL_HARD };
  }
}
