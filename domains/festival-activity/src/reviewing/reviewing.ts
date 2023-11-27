import {
  APPROVED,
  FestivalActivity,
  InReview,
  NOT_ASKING_TO_REVIEW,
  isDraft,
  Reviewer,
} from "../festival-activity";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { BARRIERES, ELEC, InquiryOwner, MATOS } from "../festival-activity";
import {
  InDraft,
  AlreadyApproved,
  NotAskingToReview,
  ShouldAssignDrive,
} from "./reviewing.error";

export type ReviewingFestivalActivities = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(festivalActivity: InReview): Promise<InReview>;
};

export class Reviewing {
  constructor(
    private readonly festivalActivities: ReviewingFestivalActivities,
  ) {}

  async approve(faId: number, team: Reviewer): Promise<InReview> {
    const festivalActivity = await this.festivalActivities.findById(faId);
    if (!festivalActivity) throw new FestivalActivityNotFound(faId);
    if (isDraft(festivalActivity)) throw new InDraft(faId);
    if (this.isAlreadyApprovedBy(festivalActivity, team)) {
      throw new AlreadyApproved(faId, team);
    }
    if (this.isNotAskingToReview(festivalActivity, team)) {
      throw new NotAskingToReview(faId, team);
    }
    if (isInquiryOwner(team)) {
      this.checkInquiryDriveAssignment(festivalActivity, team);
    }

    const reviews = { ...festivalActivity.reviews, [team]: APPROVED };
    return this.festivalActivities.save({ ...festivalActivity, reviews });
  }

  private checkInquiryDriveAssignment(
    festivalActivity: InReview,
    owner: InquiryOwner,
  ) {
    const requests = selectMyInquiryRequests(owner, festivalActivity);
    const areAllRequestsAssignedToDrive = requests.every((request) =>
      Object.hasOwn(request, "drive"),
    );
    if (!areAllRequestsAssignedToDrive) {
      throw new ShouldAssignDrive();
    }
  }

  private isAlreadyApprovedBy(festivalActivity: InReview, team: Reviewer) {
    return festivalActivity.reviews[team] === APPROVED;
  }

  private isNotAskingToReview(festivalActivity: InReview, team: Reviewer) {
    return festivalActivity.reviews[team] === NOT_ASKING_TO_REVIEW;
  }
}

function selectMyInquiryRequests(
  owner: InquiryOwner,
  festivalActivity: InReview,
) {
  switch (owner) {
    case MATOS:
      return festivalActivity.inquiry.gears;
    case BARRIERES:
      return festivalActivity.inquiry.barriers;
    case ELEC:
      return festivalActivity.inquiry.electricity;
  }
}

function isInquiryOwner(team: Reviewer | InquiryOwner): team is InquiryOwner {
  return [MATOS, ELEC, BARRIERES].includes(team);
}
