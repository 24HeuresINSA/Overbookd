import { InReviewFestivalActivity } from "./in-review-festival-activity";
import { FestivalActivityRepository } from "../festival-activity.repository";
import { FestivalActivityNotFound, Review } from "../festival-activity.error";
import { isDraft } from "../festival-activity.model";

export class AskForReview {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository
  ) { }

  async fromDraft(draftId: number): Promise<InReviewFestivalActivity> {
    const festivalActivity = await this.festivalActivities.findById(draftId);
    if (!festivalActivity) throw new FestivalActivityNotFound(draftId);
    if (!isDraft(festivalActivity)) throw new Review.NotInDraft(draftId);

    return Promise.resolve(festivalActivity.askForReview());
  }
}
