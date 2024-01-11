import { Notifications, Notifyee } from "./ask-for-review";
import { WaitingForReview } from "../sections/reviews";
import { Reviewer } from "../../common/review";

type FestivalActivityToReview = Omit<WaitingForReview, "reviewers">;

type Notification = {
  team: Reviewer<"FA">;
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
