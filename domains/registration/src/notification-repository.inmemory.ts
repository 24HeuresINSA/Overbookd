import {
  FilterNotifyees,
  NotificationRepository,
  Notifyee,
} from "./register-newcomer";
import { AdherentRegistered } from "./event";
import { WithPermissions } from "./register-newcomer.spec";

type StoredNotification = {
  event: AdherentRegistered;
  notifyee: Notifyee;
};

export type StoredNotifyee = Notifyee & WithPermissions;

export class InMemoryNotificationRepository implements NotificationRepository {
  private notifications: StoredNotification[] = [];
  constructor(private readonly notifyees: StoredNotifyee[]) {}

  add(event: AdherentRegistered, clause: FilterNotifyees): Promise<Notifyee[]> {
    const matchingNotifyees = this.notifyees.filter(({ permissions }) =>
      permissions.includes(clause.havePermission),
    );
    const notifyees = matchingNotifyees.map(({ id }) => ({ id }));
    this.notifications = [
      ...this.notifications,
      ...notifyees.map((notifyee) => ({ event, notifyee })),
    ];
    return Promise.resolve(notifyees);
  }
}
