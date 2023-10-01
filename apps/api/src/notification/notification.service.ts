import { Logger, OnApplicationBootstrap } from "@nestjs/common";
import { DomainEventService } from "../domain-event/domain-event.service";
import { filter } from "rxjs";
import { isAdherentRegistered } from "../domain-event/domain-event";
import { RegisterNewcomer } from "@overbookd/registration";

export interface NotificationRepository {
  someFor(userId: number): Promise<boolean>;
  readFrom(userId: number): Promise<void>;
}

export class NotificationService implements OnApplicationBootstrap {
  constructor(
    private readonly notifications: NotificationRepository,
    private readonly eventStore: DomainEventService,
    private readonly register: RegisterNewcomer,
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
}
