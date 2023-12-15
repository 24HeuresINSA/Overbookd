import {
  FestivalActivity,
  IN_REVIEW,
  InReview,
  Refused,
  Reviewable,
} from "../festival-activity";
import {
  InReviewReviews,
  NOT_ASKING_TO_REVIEW,
  REJECTED,
  REVIEWING,
  RefusedReviews,
} from "../sections/reviews";
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
import { FestivalActivityKeyEvents } from "../festival-activity.event";
import { Adherent } from "../sections/in-charge";

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

export class ReviewableSpecification {
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

const COMMON_REVIEWERS: Reviewer[] = [
  humain,
  signa,
  secu,
  matos,
  elec,
  barrieres,
];
const PUBLIC_REVIEWERS: Reviewer[] = [...COMMON_REVIEWERS, communication];
export class InReviewFestivalActivity implements InReview {
  private constructor(
    readonly id: InReview["id"],
    readonly general: InReview["general"],
    readonly inCharge: InReview["inCharge"],
    readonly signa: InReview["signa"],
    readonly security: InReview["security"],
    readonly supply: InReview["supply"],
    readonly inquiry: InReview["inquiry"],
    readonly reviews: InReview["reviews"],
    readonly feedbacks: InReview["feedbacks"],
    readonly history: InReview["history"],
    private readonly previousReviews?: RefusedReviews,
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  static init(
    activity: FestivalActivity,
    instigator: Adherent,
  ): InReviewFestivalActivity {
    if (!ReviewableSpecification.isSatisfiedBy(activity)) {
      throw ReviewableSpecification.generateError(activity);
    }

    const isPublic = activity.general.toPublish;
    const reviews = isPublic
      ? PUBLIC_ACTIVITY_REVIEWS
      : PRIVATE_ACTIVITY_REVIEWS;

    const history = [
      ...activity.history,
      FestivalActivityKeyEvents.readyToReview(instigator),
    ];

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
      history,
    );
  }

  static build(
    activity: Refused,
    instigator: Adherent,
  ): InReviewFestivalActivity {
    const reviews = this.swapRefusedToReviewing(activity.reviews);

    const history = [
      ...activity.history,
      FestivalActivityKeyEvents.readyToReview(instigator),
    ];

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
      history,
      activity.reviews,
    );
  }

  private static swapRefusedToReviewing(
    reviews: RefusedReviews,
  ): InReviewReviews {
    return {
      communication:
        reviews.communication !== REJECTED ? reviews.communication : REVIEWING,
      humain: reviews.humain !== REJECTED ? reviews.humain : REVIEWING,
      signa: reviews.signa !== REJECTED ? reviews.signa : REVIEWING,
      secu: reviews.secu !== REJECTED ? reviews.secu : REVIEWING,
      matos: reviews.matos !== REJECTED ? reviews.matos : REVIEWING,
      elec: reviews.elec !== REJECTED ? reviews.elec : REVIEWING,
      barrieres: reviews.barrieres !== REJECTED ? reviews.barrieres : REVIEWING,
    };
  }

  private get isPublic(): boolean {
    return this.general.toPublish;
  }

  get readyForReview(): WaitingForReview {
    return {
      id: this.id,
      name: this.general.name,
      reviewers: this.reviewersToNotify,
    };
  }

  private get reviewersToNotify(): Reviewer[] {
    if (!this.previousReviews) {
      return this.isPublic ? PUBLIC_REVIEWERS : COMMON_REVIEWERS;
    }

    return PUBLIC_REVIEWERS.filter((reviewer) => this.hasRejected(reviewer));
  }

  private hasRejected(reviewer: Reviewer): boolean {
    switch (reviewer) {
      case humain:
        return this.previousReviews?.humain === REJECTED;
      case signa:
        return this.previousReviews?.signa === REJECTED;
      case secu:
        return this.previousReviews?.secu === REJECTED;
      case matos:
        return this.previousReviews?.matos === REJECTED;
      case elec:
        return this.previousReviews?.elec === REJECTED;
      case barrieres:
        return this.previousReviews?.barrieres === REJECTED;
      case communication:
        return this.previousReviews?.communication === REJECTED;
    }
  }
}

function isPublicActivity(
  general: FestivalActivity["general"],
): general is PublicGeneral {
  return general.toPublish;
}
