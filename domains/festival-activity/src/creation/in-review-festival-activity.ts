import { IN_REVIEW } from "../festival-activity.core";
import { InquirySection } from "../festival-activity.core";
import {
  BaseFestivalActivity,
  DraftFestivalActivityRepresentation,
  GeneralSection,
  InChargeSection,
  SignaSection,
  SecuritySection,
  SupplySection,
} from "./draft-festival-activity.model";

export type InReviewFestivalActivityRepresentation = BaseFestivalActivity & {
  status: typeof IN_REVIEW;
};

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

  static init(
    draft: DraftFestivalActivityRepresentation,
  ): InReviewFestivalActivity {
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
}
