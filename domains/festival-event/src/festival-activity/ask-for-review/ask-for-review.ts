import {
  FestivalActivityNotFound,
} from "../festival-activity.error";
import { CantAskForReview } from "../../common/review.error";
import { InReviewFestivalActivity } from "./in-review-festival-activity";
import {
  Draft,
  FestivalActivity,
  Refused,
  Reviewable,
} from "../festival-activity";
import { Adherent } from "../../common/adherent";
import { Notifications } from "../../common/notifications";
import { isDraft, isRefused } from "../../festival-event";

export type AskForReviewFestivalActivityRepository = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(festivalActivity: Reviewable): Promise<Reviewable>;
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
