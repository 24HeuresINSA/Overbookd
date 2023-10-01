import { Logger, MessageEvent, OnApplicationBootstrap } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { Observable, filter, map, merge } from "rxjs";
import { isAdherentRegistered } from "../domain-event/domain-event";
import { RegisterNewcomer } from "@overbookd/registration";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { ENROLL_NEWCOMER, Permission } from "@overbookd/permission";

type AvailableNotification = {
  source: Observable<MessageEvent>;
  permission: Permission;
};

export interface NotificationRepository {
  someFor(userId: number): Promise<boolean>;
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
    const registrationEvents = this.eventStore.listen("registration");

    registrationEvents
      .pipe(filter(isAdherentRegistered))
      .subscribe(async (event) => {
        this.logger.log("Notify new adherent await validation");
        this.logger.debug(JSON.stringify(event));
        const users = await this.register.notifyAwaitForValidation(event);
        this.logger.log(`Users ${users.map(({ id }) => id)} notified`);
      });
  }

  async hasNotifications(userId: number): Promise<boolean> {
    return this.notifications.someFor(userId);
  }

  async readNotification(user: number): Promise<void> {
    await this.notifications.readFrom(user);
  }

  meInLive(token: string): Observable<MessageEvent> {
    const { permissions } = this.jwt.verify<JwtPayload>(token);

    const myNotifications = this.filterMyNotifications(permissions);
    return merge(...myNotifications);
  }

  private filterMyNotifications(
    permissions: Permission[],
  ): Observable<MessageEvent>[] {
    const availableNotifications: AvailableNotification[] = [
      this.adherentRegistered,
    ];

    return availableNotifications
      .filter(({ permission }) => permissions.includes(permission))
      .map(({ source }) => source);
  }

  private get adherentRegistered(): AvailableNotification {
    const adherentRegistered = this.eventStore.listen("registration").pipe(
      filter(isAdherentRegistered),
      map((data) => ({ type: "adherent-registered", data })),
    );
    return { source: adherentRegistered, permission: ENROLL_NEWCOMER };
  }
}
