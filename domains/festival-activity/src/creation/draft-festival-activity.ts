import { DRAFT } from "../festival-activity.core";
import { InquirySection } from "../festival-activity.core";
import { InReviewFestivalActivity } from "./in-review-festival-activity";
import {
  BaseFestivalActivity,
  DraftFestivalActivityRepresentation,
  GeneralSection,
  InChargeSection,
  SignaSection,
  SecuritySection,
  SupplySection,
} from "./draft-festival-activity.model";

export class DraftFestivalActivity
  implements DraftFestivalActivityRepresentation
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

  get status(): typeof DRAFT {
    return DRAFT;
  }

  get json(): DraftFestivalActivityRepresentation {
    return {
      id: this.id,
      general: this.general,
      inCharge: this.inCharge,
      signa: this.signa,
      security: this.security,
      supply: this.supply,
      inquiry: this.inquiry,
      status: this.status,
    };
  }

  public static build(
    draftFestivalActivity: BaseFestivalActivity,
  ): DraftFestivalActivity {
    const { id, general, inCharge, signa, security, supply, inquiry } =
      draftFestivalActivity;

    return new DraftFestivalActivity(
      id,
      general,
      inCharge,
      signa,
      security,
      supply,
      inquiry,
    );
  }

  public changeGeneralSection(
    generalUpdate: Partial<GeneralSection>,
  ): DraftFestivalActivity {
    const privateFestivalActivity = {
      toPublish: false,
      photoLink: null,
      isFlagship: false,
    };
    const cleanedUpdate =
      generalUpdate.toPublish === false
        ? { ...generalUpdate, ...privateFestivalActivity }
        : generalUpdate;
    const general = { ...this.general, ...cleanedUpdate };

    const builder = { ...this.json, general };
    return DraftFestivalActivity.build(builder);
  }

  public changeInChargeSection(
    inChargeUpdate: Partial<InChargeSection>,
  ): DraftFestivalActivity {
    const inCharge = { ...this.inCharge, ...inChargeUpdate };

    const builder = { ...this.json, inCharge };
    return DraftFestivalActivity.build(builder);
  }

  public changeSignaSection(
    signaUpdate: Partial<SignaSection>,
  ): DraftFestivalActivity {
    const signa = { ...this.signa, ...signaUpdate };

    const builder = { ...this.json, signa };
    return DraftFestivalActivity.build(builder);
  }

  public changeSecuritySection(
    securityUpdate: Partial<SecuritySection>,
  ): DraftFestivalActivity {
    const security = { ...this.security, ...securityUpdate };

    const builder = { ...this.json, security };
    return DraftFestivalActivity.build(builder);
  }

  public changeSupplySection(
    supplyUpdate: Partial<SupplySection>,
  ): DraftFestivalActivity {
    const supply = { ...this.supply, ...supplyUpdate };

    const builder = { ...this.json, supply };
    return DraftFestivalActivity.build(builder);
  }

  askForReview() {
    return InReviewFestivalActivity.init({ ...this.json });
  }
}
