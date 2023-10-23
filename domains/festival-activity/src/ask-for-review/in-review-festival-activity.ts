import { IProvidePeriod } from "@overbookd/period";
import { IN_REVIEW, Inquiry, InquirySection } from "../festival-activity.core";
import { FestivalActivityRepresentation } from "../festival-activity.model";
import {
  BaseFestivalActivity,
  GeneralSection,
  InChargeSection,
  SignaSection,
  SecuritySection,
  SupplySection,
} from "../creation/draft-festival-activity.model";
import {
  isPublicActivity,
  PublicActivityGeneralSpecification,
  ActivityGeneralSpecification,
} from "./specifications/general-section";
import { ActivityInChargeSpecification } from "./specifications/in-charge-section";
import { ActivitySignaSpecification } from "./specifications/signa-section";
import { ActivityInquirySpecification } from "./specifications/inquiry-section";
import { ReadyForReviewException } from "./ready-for-review.error";

type InReviewPrivateGeneralSection = GeneralSection & {
  name: string;
  description: string;
  toPublish: false;
  categories: string[];
  photoLink: string | null;
  isFlagship: boolean;
  timeWindows: IProvidePeriod[];
};

type InReviewPublicGeneralSection = GeneralSection & {
  name: string;
  description: string;
  toPublish: true;
  categories: [string, ...string[]];
  photoLink: string;
  isFlagship: boolean;
  timeWindows: [IProvidePeriod, ...IProvidePeriod[]];
};

type InReviewGeneralSection =
  | InReviewPrivateGeneralSection
  | InReviewPublicGeneralSection;

type InReviewInChargeSection = InChargeSection & {
  team: string;
};

type InReviewSignaSection = SignaSection & {
  location: string;
};

export type InReviewWithTimeWindowsInquirySection = InquirySection & {
  timeWindows: [IProvidePeriod, ...IProvidePeriod[]];
};

type WithGearsInquirySection = InquirySection & {
  gears: [Inquiry, ...Inquiry[]];
};
type WithBarriersInquirySection = InquirySection & {
  barrieres: [Inquiry, ...Inquiry[]];
};
type WithElectricityInquirySection = InquirySection & {
  electricity: [Inquiry, ...Inquiry[]];
};
export type InReviewWithRequestInquirySection =
  | WithGearsInquirySection
  | WithBarriersInquirySection
  | WithElectricityInquirySection;

type InReviewInquirySection =
  | InquirySection
  | InReviewWithRequestInquirySection
  | InReviewWithTimeWindowsInquirySection;

export type InReviewFestivalActivityRepresentation = BaseFestivalActivity & {
  status: typeof IN_REVIEW;
  general: InReviewGeneralSection;
  inCharge: InReviewInChargeSection;
  signa: InReviewSignaSection;
  inquiry: InReviewInquirySection;
};

export const comcom = "comcom";
export const humain = "humain";
export const signa = "signa";
export const secu = "secu";
export const matos = "matos";
export const elec = "elec";
export const barrieres = "barrieres";

type Reviewer =
  | typeof comcom
  | typeof humain
  | typeof signa
  | typeof secu
  | typeof matos
  | typeof elec
  | typeof barrieres;

type WaitingForReview = {
  id: number;
  name: string;
  reviewers: Reviewer[];
};

class ReadyForReview {
  static isSatifiedBy(
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
    readonly general: InReviewGeneralSection,
    readonly inCharge: InReviewInChargeSection,
    readonly signa: InReviewSignaSection,
    readonly security: SecuritySection,
    readonly supply: SupplySection,
    readonly inquiry: InReviewInquirySection,
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  static init(draft: FestivalActivityRepresentation): InReviewFestivalActivity {
    if (!ReadyForReview.isSatifiedBy(draft)) {
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
