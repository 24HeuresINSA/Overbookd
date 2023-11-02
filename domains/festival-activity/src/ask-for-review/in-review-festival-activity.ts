import { FestivalActivity, IN_REVIEW, InReview } from "../festival-activity";
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
} from "./waiting-for-review";
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
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  static init(draft: FestivalActivity): InReviewFestivalActivity {
    if (!ReadyForReview.isSatisfiedBy(draft)) {
      throw ReadyForReview.generateError(draft);
    }

    return new InReviewFestivalActivity(
      draft.id,
      draft.general,
      draft.inCharge,
      draft.signa,
      draft.security,
      draft.supply,
      draft.inquiry,
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
