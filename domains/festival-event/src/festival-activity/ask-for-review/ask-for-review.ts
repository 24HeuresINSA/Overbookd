import {
  CantAskForReview,
  FestivalActivityNotFound,
} from "../festival-activity.error";
import { InReviewFestivalActivity } from "./in-review-festival-activity";
import {
  Draft,
  FestivalActivity,
  Refused,
  Reviewable,
  isDraft,
  isRefused,
} from "../festival-activity";
import { WaitingForReview } from "../sections/reviews";
import { Reviewer } from "../../common/review";
import { Adherent } from "../../common/adherent";

export type AskForReviewFestivalActivityRepository = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(festivalActivity: Reviewable): Promise<Reviewable>;
};

export type Notifyee = {
  team: Reviewer<"FA">;
};

export type Notifications = {
  add(event: WaitingForReview): Promise<Notifyee[]>;
};

export class AskForReview {
  constructor(
    private readonly festivalActivities: AskForReviewFestivalActivityRepository,
    private readonly notifications: Notifications,
  ) {}

  async from(
    activityId: FestivalActivity["id"],
    instigator: Adherent,
  ): Promise<Reviewable> {
    const festivalActivity = await this.festivalActivities.findById(activityId);
    if (!festivalActivity) throw new FestivalActivityNotFound(activityId);

    if (isDraft(festivalActivity)) {
      return this.fromDraft(festivalActivity, instigator);
    }

    if (isRefused(festivalActivity)) {
      return this.fromRefused(festivalActivity, instigator);
    }

    throw new CantAskForReview(activityId);
  }

  private async fromDraft(
    activity: Draft,
    instigator: Adherent,
  ): Promise<Reviewable> {
    const inReview = InReviewFestivalActivity.init(activity, instigator);

    this.notifications.add(inReview.readyForReview);
    return this.festivalActivities.save(inReview);
  }

  private async fromRefused(
    activity: Refused,
    instigator: Adherent,
  ): Promise<Reviewable> {
    const inReview = InReviewFestivalActivity.build(activity, instigator);

    this.notifications.add(inReview.readyForReview);
    return this.festivalActivities.save(inReview);
  }
}
