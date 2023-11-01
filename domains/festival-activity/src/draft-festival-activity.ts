import { DRAFT } from "./festival-activity.core";
import { InReviewFestivalActivity } from "./ask-for-review/in-review-festival-activity";
import {
  DraftFestivalActivityBuilder,
  DraftFestivalActivityRepresentation,
  DraftGeneralSection,
  DraftInChargeSection,
  DraftInquirySection,
  DraftSecuritySection,
  DraftSignaSection,
  DraftSupplySection,
} from "./creation/draft-festival-activity.model";
import { IProvidePeriod } from "@overbookd/period";
import {
  PrepareGeneralSectionForm,
  PrepareInChargeSectionForm,
  PrepareSecuritySectionForm,
  PrepareSignaSectionForm,
  PrepareSupplySectionForm,
} from "./preparation/prepare-festival-activity.model";
import { PrepareGeneralSection } from "./preparation/prepare-general-section";

export class DraftFestivalActivity
  implements DraftFestivalActivityRepresentation
{
  private constructor(
    readonly id: number,
    readonly general: DraftGeneralSection,
    readonly inCharge: DraftInChargeSection,
    readonly signa: DraftSignaSection,
    readonly security: DraftSecuritySection,
    readonly supply: DraftSupplySection,
    readonly inquiry: DraftInquirySection,
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
    draftFestivalActivity: DraftFestivalActivityBuilder,
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
    generalUpdate: PrepareGeneralSectionForm,
  ): DraftFestivalActivity {
    const general = PrepareGeneralSection.build(this.general).update(
      generalUpdate,
    );

    const builder = { ...this.json, general };
    return DraftFestivalActivity.build(builder);
  }

  public addTimeWindowInGeneral(period: IProvidePeriod): DraftFestivalActivity {
    const timeWindowForm = { faId: this.id, period };
    const general = PrepareGeneralSection.build(this.general).addTimeWindow(
      timeWindowForm,
    );

    const builder = { ...this.json, general };
    return DraftFestivalActivity.build(builder);
  }

  public removeTimeWindowFromGeneral(
    timeWindowId: string,
  ): DraftFestivalActivity {
    const general = PrepareGeneralSection.build(this.general).removeTimeWindow(
      timeWindowId,
    );

    const builder = { ...this.json, general };
    return DraftFestivalActivity.build(builder);
  }

  public changeInChargeSection(
    inChargeUpdate: PrepareInChargeSectionForm,
  ): DraftFestivalActivity {
    const inCharge = { ...this.inCharge, ...inChargeUpdate };

    const builder = { ...this.json, inCharge };
    return DraftFestivalActivity.build(builder);
  }

  public changeSignaSection(
    signaUpdate: PrepareSignaSectionForm,
  ): DraftFestivalActivity {
    const signa = { ...this.signa, ...signaUpdate };

    const builder = { ...this.json, signa };
    return DraftFestivalActivity.build(builder);
  }

  public changeSecuritySection(
    securityUpdate: PrepareSecuritySectionForm,
  ): DraftFestivalActivity {
    const security = { ...this.security, ...securityUpdate };

    const builder = { ...this.json, security };
    return DraftFestivalActivity.build(builder);
  }

  public changeSupplySection(
    supplyUpdate: PrepareSupplySectionForm,
  ): DraftFestivalActivity {
    const supply = { ...this.supply, ...supplyUpdate };

    const builder = { ...this.json, supply };
    return DraftFestivalActivity.build(builder);
  }

  askForReview() {
    return InReviewFestivalActivity.init({ ...this.json });
  }
}
