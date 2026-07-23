import { FestivalActivityNotFound } from "../festival-activity.error.js";
import { CantAskForReview } from "../../common/review.error.js";
import { InReviewFestivalActivity } from "./in-review-festival-activity.js";
import { Reviewer } from "../../common/review.js";
import {
  Draft,
  FestivalActivity,
  Refused,
  Reviewable,
} from "../festival-activity.js";
import { Adherent } from "../../common/adherent.js";
import { isDraft, isRefused } from "../../festival-event.js";
import {
  BARRIERES,
  COMMUNICATION,
  HUMAIN,
  LOG_ELEC,
  LOG_MATOS,
  SECU,
  SIGNA,
} from "@overbookd/team-constants";

export type AskForReviewFestivalActivityRepository = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(festivalActivity: Reviewable): Promise<Reviewable>;
};

export class AskForReview {
  constructor(
    private readonly festivalActivities: AskForReviewFestivalActivityRepository,
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
    return this.festivalActivities.save(inReview);
  }

  private async fromRefused(
    activity: Refused,
    instigator: Adherent,
  ): Promise<Reviewable> {
    const inReview = InReviewFestivalActivity.build(activity, instigator);
    return this.festivalActivities.save(inReview);
  }
}

export function isReviewer(team: string): team is Reviewer<"FA"> {
  return [
    BARRIERES,
    COMMUNICATION,
    LOG_ELEC,
    HUMAIN,
    LOG_MATOS,
    SECU,
    SIGNA,
  ].includes(team);
}
