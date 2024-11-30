import { Logger, OnApplicationBootstrap } from "@nestjs/common";
import { RegisterNewcomer } from "@overbookd/registration";
import { DomainEventService } from "../domain-event/domain-event.service";

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
}
