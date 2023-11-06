import {
  FestivalActivity,
  IN_REVIEW,
  InReview,
  REVIEWING,
} from "../festival-activity";
import {
  isPublicActivity,
  PublicActivityGeneralSpecification,
  ActivityGeneralSpecification,
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
  comcom,
  PrivateActivityReviewer,
  PublicActivityReviewer,
} from "./waiting-for-review";

type MandatoryReviews<T extends Reviewer> = Record<T, typeof REVIEWING> &
  Record<Exclude<Reviewer, T>, undefined>;

const PRIVATE_ACTIVITY_REVIEWS: MandatoryReviews<PrivateActivityReviewer> = {
  comcom: undefined,
  humain: REVIEWING,
  signa: REVIEWING,
  secu: REVIEWING,
  matos: REVIEWING,
  elec: REVIEWING,
  barrieres: REVIEWING,
};

const PUBLIC_ACTIVITY_REVIEWS: MandatoryReviews<PublicActivityReviewer> = {
  comcom: REVIEWING,
  humain: REVIEWING,
  signa: REVIEWING,
  secu: REVIEWING,
  matos: REVIEWING,
  elec: REVIEWING,
  barrieres: REVIEWING,
};

class ReadyForReview {
  static isSatisfiedBy(
    festivalActivity: FestivalActivity,
  ): festivalActivity is InReview {
    return this.errors(festivalActivity).length === 0;
  }

  static generateError(
    festivalActivity: FestivalActivity,
  ): ReadyForReviewException {
    return new ReadyForReviewException(this.errors(festivalActivity));
  }

  private static errors(festivalActivity: FestivalActivity): string[] {
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
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  static init(draft: FestivalActivity): InReviewFestivalActivity {
    if (!ReadyForReview.isSatisfiedBy(draft)) {
      throw ReadyForReview.generateError(draft);
    }

    const isPublic = draft.general.toPublish;
    const reviews = isPublic
      ? PUBLIC_ACTIVITY_REVIEWS
      : PRIVATE_ACTIVITY_REVIEWS;

    return new InReviewFestivalActivity(
      draft.id,
      draft.general,
      draft.inCharge,
      draft.signa,
      draft.security,
      draft.supply,
      draft.inquiry,
      reviews,
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
      reviewers: this.isPublic ? [...reviewers, comcom] : reviewers,
    };
  }
}
