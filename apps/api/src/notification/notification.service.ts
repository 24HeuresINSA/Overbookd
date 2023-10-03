import { Logger, MessageEvent, OnApplicationBootstrap } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { Observable, map, merge } from "rxjs";
import { ADHERENT_REGISTERED, RegisterNewcomer } from "@overbookd/registration";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { ENROLL_NEWCOMER, Permission } from "@overbookd/permission";
import { OverbookdEventType } from "../domain-event/domain-event";

type AvailableNotification = {
  source: Observable<DomainNotification>;
  permission: Permission;
};

type DomainNotification = MessageEvent & {
  type: OverbookdEventType;
};

export interface NotificationRepository {
  for(userId: number): Promise<boolean>;
  readFrom(userId: number): Promise<void>;
}

export class NotificationService implements OnApplicationBootstrap {
  constructor(
    private readonly notifications: NotificationRepository,
    private readonly eventStore: DomainEventService,
    private readonly register: RegisterNewcomer,
    private readonly jwt: JwtService,
  ) {}

  private logger = new Logger("NotificationService");

  onApplicationBootstrap() {
    this.eventStore.adherentRegisteredEvents.subscribe(async (event) => {
      this.logger.debug(JSON.stringify(event));
      const users = await this.register.notifyAwaitForValidation(event);
      const notifyees = users.map(({ id }) => id);
      const logMessage = `Users ${notifyees} notified new adherent await validation`;
      this.logger.log(logMessage);
    });
  }

  async hasNotifications(userId: number): Promise<boolean> {
    return this.notifications.for(userId);
  }

  async readNotification(user: number): Promise<void> {
    await this.notifications.readFrom(user);
  }

  inLive(token: string): Observable<DomainNotification> {
    const { permissions } = this.jwt.verify<JwtPayload>(token);

    const myNotifications = this.filterMyNotifications(permissions);
    return merge(...myNotifications);
  }

  private filterMyNotifications(
    permissions: Permission[],
  ): Observable<DomainNotification>[] {
    const availableNotifications: AvailableNotification[] = [
      this.adherentRegistered,
    ];

    return availableNotifications
      .filter(({ permission }) => permissions.includes(permission))
      .map(({ source }) => source);
  }

  private get adherentRegistered(): AvailableNotification {
    const adherentRegistered = this.eventStore.adherentRegisteredEvents.pipe(
      map((data): DomainNotification => ({ type: ADHERENT_REGISTERED, data })),
    );
    return { source: adherentRegistered, permission: ENROLL_NEWCOMER };
  }
}
