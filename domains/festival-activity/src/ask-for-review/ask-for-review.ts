import { FestivalActivityNotFound, Review } from "../festival-activity.error";
import { InReviewFestivalActivity } from "./in-review-festival-activity";
import { FestivalActivity, Reviewable, isDraft } from "../festival-activity";
import { Reviewer, WaitingForReview } from "../sections/reviews";
import { Adherent } from "../sections/in-charge";

export type AskForReviewFestivalActivityRepository = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(festivalActivity: Reviewable): Promise<Reviewable>;
};

export type Notifyee = {
  team: Reviewer;
};

export type Notifications = {
  add(event: WaitingForReview): Promise<Notifyee[]>;
};

export class AskForReview {
  constructor(
    private readonly festivalActivities: AskForReviewFestivalActivityRepository,
    private readonly notifications: Notifications,
  ) {}

  async fromDraft(
    draftId: FestivalActivity["id"],
    instigator: Adherent,
  ): Promise<Reviewable> {
    const festivalActivity = await this.festivalActivities.findById(draftId);
    if (!festivalActivity) throw new FestivalActivityNotFound(draftId);
    if (!isDraft(festivalActivity)) throw new Review.NotInDraft(draftId);

    const inReview = InReviewFestivalActivity.init(
      festivalActivity,
      instigator,
    );
    this.notifications.add(inReview.readyForReview);
    return this.festivalActivities.save(inReview);
  }
}
