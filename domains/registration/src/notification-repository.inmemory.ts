import { Permission } from "@overbookd/permission";
import { StaffRegistered } from "./newcomer.js";
import {
  FilterNotifyees,
  NotificationRepository,
  Notifyee,
} from "./register-newcomer.js";

type StoredNotification = {
  event: StaffRegistered;
  notifyee: Notifyee;
};

type WithPermissions = {
  permissions: Permission[];
};

export type StoredNotifyee = Notifyee & WithPermissions;

export class InMemoryNotificationRepository implements NotificationRepository {
  private notifications: StoredNotification[] = [];
  constructor(private readonly notifyees: StoredNotifyee[]) {}

  add(event: StaffRegistered, clause: FilterNotifyees): Promise<Notifyee[]> {
    const matchingNotifyees = this.notifyees.filter(({ permissions }) =>
      permissions.includes(clause.permission),
    );
    const notifyees = matchingNotifyees.map(({ id }) => ({ id }));

    this.notifications = [
      ...this.notifications,
      ...notifyees.map((notifyee) => ({ event, notifyee })),
    ];

    return Promise.resolve(notifyees);
  }
}
