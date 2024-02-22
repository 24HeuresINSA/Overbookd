import { FestivalActivity, Refused, Reviewable } from "../festival-activity";
import { IN_REVIEW, REFUSED, VALIDATED } from "../../common/status";
import {
  Reviews,
  isRefusedReviews,
  isValidatedReviews,
} from "../sections/reviews";
import { Reviewer } from "../../common/review";
import {
  NOT_ASKING_TO_REVIEW,
  barrieres,
  communication,
  elec,
  humain,
  matos,
  secu,
  signa,
} from "../../common/review";
import { APPROVED, REJECTED } from "../../common/action";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { BARRIERES, ELEC, InquiryOwner, MATOS } from "../sections/inquiry";
import {
  InDraft,
  AlreadyApproved,
  ShouldAssignDrive,
  AlreadyRejected,
  ShouldLinkCatalogItem,
} from "./reviewing.error";
import { Adherent } from "../../common/adherent";
import { FestivalActivityKeyEvents } from "../festival-activity.event";
import { isLinkedToCatalogItem } from "../sections/signa";
import { NotAskingToReview } from "../../common/review.error";
import { Rejection } from "../../common/review";
import { isDraft } from "../../festival-event";

export type ReviewingFestivalActivities = {
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save<T extends Reviewable>(festivalActivity: T): Promise<T>;
};

export class Reviewing {
  constructor(
    private readonly festivalActivities: ReviewingFestivalActivities,
  ) {}

  async approve(
    faId: FestivalActivity["id"],
    team: Reviewer<"FA">,
    approver: Adherent,
  ): Promise<Reviewable> {
    const festivalActivity = await this.festivalActivities.findById(faId);
    if (!festivalActivity) throw new FestivalActivityNotFound(faId);
    if (isDraft(festivalActivity)) throw new InDraft(faId);
    if (this.isAlreadyApprovedBy(festivalActivity, team)) {
      throw new AlreadyApproved(faId, team);
    }
    if (this.isNotAskingToReview(festivalActivity, team)) {
      throw new NotAskingToReview(faId, team, "FA");
    }
    if (isInquiryOwner(team)) {
      this.checkInquiryDriveAssignment(festivalActivity, team);
    }
    if (team === signa) {
      this.checkSignageCatalogItemLink(festivalActivity);
    }

    const reviews = { ...festivalActivity.reviews, [team]: APPROVED };
    const history = [
      ...festivalActivity.history,
      FestivalActivityKeyEvents.approved(approver),
    ];
    return this.saveFestivalActivity(festivalActivity, reviews, history);
  }

  async reject(
    faId: FestivalActivity["id"],
    { team, rejector, reason }: Rejection<"FA">,
  ): Promise<Refused> {
    const festivalActivity = await this.festivalActivities.findById(faId);
    if (!festivalActivity) throw new FestivalActivityNotFound(faId);
    if (isDraft(festivalActivity)) throw new InDraft(faId);
    if (this.isNotAskingToReview(festivalActivity, team)) {
      throw new NotAskingToReview(faId, team, "FA");
    }
    if (this.isAlreadyRejectedBy(festivalActivity, team)) {
      throw new AlreadyRejected(faId, team);
    }

    const reviews = { ...festivalActivity.reviews, [team]: REJECTED };
    const history = [
      ...festivalActivity.history,
      FestivalActivityKeyEvents.rejected(rejector, reason),
    ];

    return this.festivalActivities.save({
      ...festivalActivity,
      status: REFUSED,
      reviews,
      history,
    });
  }

  private async saveFestivalActivity(
    storedActivity: Reviewable,
    reviews: Reviewable["reviews"],
    history: Reviewable["history"],
  ): Promise<Reviewable> {
    if (isValidatedReviews(reviews)) {
      return this.festivalActivities.save({
        ...storedActivity,
        status: VALIDATED,
        reviews,
        history,
      });
    }

    if (isRefusedReviews(reviews)) {
      return this.festivalActivities.save({
        ...storedActivity,
        status: REFUSED,
        reviews,
        history,
      });
    }

    return this.festivalActivities.save({
      ...storedActivity,
      status: IN_REVIEW,
      reviews,
      history,
    });
  }

  private checkInquiryDriveAssignment(
    festivalActivity: Reviewable,
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

  private checkSignageCatalogItemLink(festivalActivity: Reviewable) {
    const signages = festivalActivity.signa.signages;
    const areAllSignagesLinkedToCatalogItem = signages.every((signage) =>
      isLinkedToCatalogItem(signage),
    );
    if (!areAllSignagesLinkedToCatalogItem) {
      throw new ShouldLinkCatalogItem();
    }
  }

  private isAlreadyApprovedBy(
    festivalActivity: Reviewable,
    team: Reviewer<"FA">,
  ) {
    const teamReview = getTeamReview(festivalActivity.reviews, team);
    return teamReview === APPROVED;
  }

  private isAlreadyRejectedBy(
    festivalActivity: Reviewable,
    team: Reviewer<"FA">,
  ) {
    const teamReview = getTeamReview(festivalActivity.reviews, team);
    return teamReview === REJECTED;
  }

  private isNotAskingToReview(
    festivalActivity: Reviewable,
    team: Reviewer<"FA">,
  ) {
    const teamReview = getTeamReview(festivalActivity.reviews, team);
    return teamReview === NOT_ASKING_TO_REVIEW;
  }
}

function getTeamReview(reviews: Reviews, team: Reviewer<"FA">) {
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
    case communication:
      return reviews.communication;
  }
}

function selectMyInquiryRequests(
  owner: InquiryOwner,
  festivalActivity: Reviewable,
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

function isInquiryOwner(
  team: Reviewer<"FA"> | InquiryOwner,
): team is InquiryOwner {
  return [MATOS, ELEC, BARRIERES].includes(team);
}
