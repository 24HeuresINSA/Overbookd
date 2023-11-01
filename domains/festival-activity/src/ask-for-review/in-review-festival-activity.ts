import {
  GeneralSection,
  IN_REVIEW,
  InChargeSection,
  InquirySection,
  SecuritySection,
  SignaSection,
  SupplySection,
} from "../festival-activity.core";
import { FestivalActivityRepresentation } from "../festival-activity.model";
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

export type InReviewFestivalActivityRepresentation = {
  id: number;
  status: typeof IN_REVIEW;
  general: GeneralSection;
  inCharge: InChargeSection;
  security: SecuritySection;
  signa: SignaSection;
  supply: SupplySection;
  inquiry: InquirySection;
};

class ReadyForReview {
  static isSatisfiedBy(
    festivalActivity: FestivalActivityRepresentation,
  ): festivalActivity is InReviewFestivalActivityRepresentation {
    return this.errors(festivalActivity).length === 0;
  }

  static generateError(
    festivalActivity: FestivalActivityRepresentation,
  ): ReadyForReviewException {
    return new ReadyForReviewException(this.errors(festivalActivity));
  }

  private static errors(
    festivalActivity: FestivalActivityRepresentation,
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

export class InReviewFestivalActivity
  implements InReviewFestivalActivityRepresentation
{
  private constructor(
    readonly id: number,
    readonly general: GeneralSection,
    readonly inCharge: InChargeSection,
    readonly signa: SignaSection,
    readonly security: SecuritySection,
    readonly supply: SupplySection,
    readonly inquiry: InquirySection,
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  static init(draft: FestivalActivityRepresentation): InReviewFestivalActivity {
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
