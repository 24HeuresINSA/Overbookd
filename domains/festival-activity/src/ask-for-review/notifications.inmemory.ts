import { Notifications, Notifyee } from "./ask-for-review";
import { PublicActivityReviewer, WaitingForReview } from "./waiting-for-review";

type FestivalActivityToReview = Omit<WaitingForReview, "reviewers">;

type Notification = {
  team: PublicActivityReviewer;
  event: FestivalActivityToReview;
};

export class InMemoryNotifications implements Notifications {
  constructor(private _notifications: Notification[] = []) {}

  get entries(): Notification[] {
    return this._notifications;
  }

  add(event: WaitingForReview): Promise<Notifyee[]> {
    const notifications = event.reviewers.map((team) => ({
      team,
      event: { id: event.id, name: event.name },
    }));
    this._notifications = [...this._notifications, ...notifications];
    return Promise.resolve(notifications);
  }
}
