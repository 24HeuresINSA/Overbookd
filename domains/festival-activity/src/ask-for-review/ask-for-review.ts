import { FestivalActivityNotFound, Review } from "../festival-activity.error";
import { InReviewFestivalActivity } from "./in-review-festival-activity";
import { FestivalActivity, InReview, isDraft } from "../festival-activity";
import { Reviewer, WaitingForReview } from "../festival-activity";

export type AskForReviewFestivalActivityRepository = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(festivalActivity: InReview): Promise<InReview>;
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

  async fromDraft(draftId: FestivalActivity["id"]): Promise<InReview> {
    const festivalActivity = await this.festivalActivities.findById(draftId);
    if (!festivalActivity) throw new FestivalActivityNotFound(draftId);
    if (!isDraft(festivalActivity)) throw new Review.NotInDraft(draftId);

    const inReview = InReviewFestivalActivity.init(festivalActivity);
    this.notifications.add(inReview.readyForReview);
    return this.festivalActivities.save(inReview);
  }
}
