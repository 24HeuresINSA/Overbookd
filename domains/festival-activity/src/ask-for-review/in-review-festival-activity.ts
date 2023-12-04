import { FestivalActivity, IN_REVIEW, Reviewable } from "../festival-activity";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../sections/reviews";
import {
  PublicActivityGeneralSpecification,
  ActivityGeneralSpecification,
  PublicGeneral,
} from "./specifications/general-section-specification";
import { ActivityInChargeSpecification } from "./specifications/in-charge-section-specification";
import { ActivitySignaSpecification } from "./specifications/signa-section-specification";
import { ActivityInquirySpecification } from "./specifications/inquiry-section-specification";
import { ReadyForReviewException } from "./ready-for-review.error";
import {
  WaitingForReview,
  Reviewer,
  humain,
  signa,
  secu,
  matos,
  elec,
  barrieres,
  communication,
  PrivateActivityReviewer,
  PublicActivityReviewer,
} from "../sections/reviews";

type MandatoryReviews<T extends Reviewer> = Record<T, typeof REVIEWING> &
  Record<Exclude<Reviewer, T>, typeof NOT_ASKING_TO_REVIEW>;

const PRIVATE_ACTIVITY_REVIEWS: MandatoryReviews<PrivateActivityReviewer> = {
  communication: NOT_ASKING_TO_REVIEW,
  humain: REVIEWING,
  signa: REVIEWING,
  secu: REVIEWING,
  matos: REVIEWING,
  elec: REVIEWING,
  barrieres: REVIEWING,
};

const PUBLIC_ACTIVITY_REVIEWS: MandatoryReviews<PublicActivityReviewer> = {
  communication: REVIEWING,
  humain: REVIEWING,
  signa: REVIEWING,
  secu: REVIEWING,
  matos: REVIEWING,
  elec: REVIEWING,
  barrieres: REVIEWING,
};

export type FestivalActivityWithoutStatus = Omit<FestivalActivity, "status">;
export type InReviewWithoutStatus = Omit<Reviewable, "status">;

export class InReviewSpecification {
  static isSatisfiedBy(
    festivalActivity: FestivalActivityWithoutStatus,
  ): festivalActivity is InReviewWithoutStatus {
    return this.errors(festivalActivity).length === 0;
  }

  static generateError(
    festivalActivity: FestivalActivity,
  ): ReadyForReviewException {
    return new ReadyForReviewException(this.errors(festivalActivity));
  }

  private static errors(
    festivalActivity: FestivalActivityWithoutStatus,
  ): string[] {
    const general = isPublicActivity(festivalActivity.general)
      ? PublicActivityGeneralSpecification.errors(festivalActivity.general)
      : ActivityGeneralSpecification.errors(festivalActivity.general);

    const inCharge = ActivityInChargeSpecification.errors(
      festivalActivity.inCharge,
    );

    const signa = ActivitySignaSpecification.errors(festivalActivity.signa);

    const inquiry = ActivityInquirySpecification.errors(
      festivalActivity.inquiry,
    );

    return [...general, ...inCharge, ...signa, ...inquiry];
  }
}

export class InReviewFestivalActivity implements Reviewable {
  private constructor(
    readonly id: Reviewable["id"],
    readonly general: Reviewable["general"],
    readonly inCharge: Reviewable["inCharge"],
    readonly signa: Reviewable["signa"],
    readonly security: Reviewable["security"],
    readonly supply: Reviewable["supply"],
    readonly inquiry: Reviewable["inquiry"],
    readonly reviews: Reviewable["reviews"],
    readonly feedbacks: Reviewable["feedbacks"],
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  static init(activity: FestivalActivity): InReviewFestivalActivity {
    if (!InReviewSpecification.isSatisfiedBy(activity)) {
      throw InReviewSpecification.generateError(activity);
    }

    const isPublic = activity.general.toPublish;
    const reviews = isPublic
      ? PUBLIC_ACTIVITY_REVIEWS
      : PRIVATE_ACTIVITY_REVIEWS;

    return new InReviewFestivalActivity(
      activity.id,
      activity.general,
      activity.inCharge,
      activity.signa,
      activity.security,
      activity.supply,
      activity.inquiry,
      reviews,
      activity.feedbacks,
    );
  }

  private get isPublic(): boolean {
    return this.general.toPublish;
  }

  get readyForReview(): WaitingForReview {
    const reviewers: Reviewer[] = [humain, signa, secu, matos, elec, barrieres];
    return {
      id: this.id,
      name: this.general.name,
      reviewers: this.isPublic ? [...reviewers, communication] : reviewers,
    };
  }
}

function isPublicActivity(
  general: FestivalActivity["general"],
): general is PublicGeneral {
  return general.toPublish;
}
