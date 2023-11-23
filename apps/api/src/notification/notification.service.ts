import { Logger, OnApplicationBootstrap } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { Observable, merge } from "rxjs";
import { ADHERENT_REGISTERED, RegisterNewcomer } from "@overbookd/registration";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { ENROLL_ADHERENT, Permission } from "@overbookd/permission";
import { DomainEvent } from "@overbookd/domain-events";

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
    this.eventStore.adherentsRegistered.subscribe(async (event) => {
      this.logger.debug(JSON.stringify(event));
      const users = await this.register.notifyNewAdherentAwaits(event);
      const notifyees = users.map(({ id }) => id);
      const logMessage = `Users ${notifyees} notified new adherent await validation`;
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
      this.adherentRegistered,
    ];

    return availableNotifications
      .filter(({ permission }) => permissions.includes(permission))
      .map(({ source }) => source);
  }

  private get adherentRegistered(): AvailableNotification {
    const adherentRegistered = this.eventStore.listen(ADHERENT_REGISTERED);
    return { source: adherentRegistered, permission: ENROLL_ADHERENT };
  }
}
