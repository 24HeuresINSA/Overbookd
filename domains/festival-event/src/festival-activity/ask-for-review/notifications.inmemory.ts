import { Notifications, Notifyee } from "../../common/notifications.js";
import { WaitingForReview } from "../../common/notifications.js";
import { Reviewer } from "../../common/review.js";
import { FestivalEventIdentifier } from "../../common/festival-event.js";

type FestivalActivityToReview = Omit<WaitingForReview<"FA">, "reviewers">;

type Notification<T extends FestivalEventIdentifier> = {
  team: Reviewer<T>;
  event: FestivalActivityToReview;
};

export class InMemoryNotifications<
  T extends FestivalEventIdentifier,
> implements Notifications<T> {
  constructor(private _notifications: Notification<T>[] = []) {}

  get entries(): Notification<T>[] {
    return this._notifications;
  }

  add(event: WaitingForReview<T>): Promise<Notifyee<T>[]> {
    const notifications = event.reviewers.map((team) => ({
      team,
      event: { id: event.id, name: event.name },
    }));
    this._notifications = [...this._notifications, ...notifications];
    return Promise.resolve(notifications);
  }
}
