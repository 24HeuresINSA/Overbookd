import { FestivalActivity, InReview, isDraft } from "../festival-activity";
import {
  APPROVED,
  NOT_ASKING_TO_REVIEW,
  Reviewer,
  Reviews,
  barrieres,
  comcom,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "../sections/reviews";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { BARRIERES, ELEC, InquiryOwner, MATOS } from "../sections/inquiry";
import {
  InDraft,
  AlreadyApproved,
  NotAskingToReview,
  ShouldAssignDrive,
} from "./reviewing.error";
import { Adherent } from "../sections/in-charge";
import { Approved, FestivalActivityEvents } from "../festival-activity.event";

export type ReviewingFestivalActivities = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(festivalActivity: InReview): Promise<InReview>;
};

export class Reviewing {
  constructor(
    private readonly festivalActivities: ReviewingFestivalActivities,
  ) {}

  async approve(
    faId: number,
    team: Reviewer,
    approverId: Adherent["id"],
  ): Promise<Approved> {
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
    const saved = await this.festivalActivities.save({
      ...festivalActivity,
      reviews,
    });
    return FestivalActivityEvents.approved(saved, approverId);
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
    const teamReview = getTeamReview(festivalActivity.reviews, team);
    return teamReview === APPROVED;
  }

  private isNotAskingToReview(festivalActivity: InReview, team: Reviewer) {
    const teamReview = getTeamReview(festivalActivity.reviews, team);
    return teamReview === NOT_ASKING_TO_REVIEW;
  }
}

function getTeamReview(reviews: Reviews, team: Reviewer) {
  switch (team) {
    case humain:
      return reviews.humain;
    case signa:
      return reviews.signa;
    case secu:
      return reviews.secu;
    case matos:
      return reviews.matos;
    case elec:
      return reviews.elec;
    case barrieres:
      return reviews.barrieres;
    case comcom:
      return reviews.comcom;
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
