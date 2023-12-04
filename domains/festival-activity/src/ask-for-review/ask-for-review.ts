import { FestivalActivityNotFound, Review } from "../festival-activity.error";
import { InReviewFestivalActivity } from "./in-review-festival-activity";
import { FestivalActivity, Reviewable, isDraft } from "../festival-activity";
import { Reviewer, WaitingForReview } from "../sections/reviews";
import { Adherent } from "../sections/in-charge";
import {
  FestivalActivityEvents,
  ReadyToReview,
} from "../festival-activity.event";

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
    instigatorId: Adherent["id"],
  ): Promise<ReadyToReview> {
    const festivalActivity = await this.festivalActivities.findById(draftId);
    if (!festivalActivity) throw new FestivalActivityNotFound(draftId);
    if (!isDraft(festivalActivity)) throw new Review.NotInDraft(draftId);

    const inReview = InReviewFestivalActivity.init(festivalActivity);
    this.notifications.add(inReview.readyForReview);
    const saved = await this.festivalActivities.save(inReview);
    return FestivalActivityEvents.readyToReview(saved, instigatorId);
  }
}
