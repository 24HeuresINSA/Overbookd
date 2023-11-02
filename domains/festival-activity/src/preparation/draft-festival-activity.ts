import { DRAFT } from "../festival-activity";
import { InReviewFestivalActivity } from "../ask-for-review/in-review-festival-activity";
import {
  DraftFestivalActivityBuilder,
  DraftFestivalActivityRepresentation,
  DraftGeneralSection,
  DraftInChargeSection,
  DraftInquirySection,
  DraftSecuritySection,
  DraftSigna,
  DraftSupplySection,
} from "./creation/draft-festival-activity.model";
import { IProvidePeriod } from "@overbookd/period";
import {
  PrepareGeneralForm,
  PrepareInChargeForm,
  PrepareSecurityForm,
  PrepareSignaForm,
  PrepareSupplyForm,
} from "./prepare-festival-activity.model";
import { PrepareGeneralSection } from "./prepare-general-section";

export class DraftFestivalActivity
  implements DraftFestivalActivityRepresentation
{
  private constructor(
    readonly id: number,
    readonly general: DraftGeneralSection,
    readonly inCharge: DraftInChargeSection,
    readonly signa: DraftSigna,
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
    generalUpdate: PrepareGeneralForm,
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
    inChargeUpdate: PrepareInChargeForm,
  ): DraftFestivalActivity {
    const inCharge = { ...this.inCharge, ...inChargeUpdate };

    const builder = { ...this.json, inCharge };
    return DraftFestivalActivity.build(builder);
  }

  public changeSignaSection(
    signaUpdate: PrepareSignaForm,
  ): DraftFestivalActivity {
    const signa = { ...this.signa, ...signaUpdate };

    const builder = { ...this.json, signa };
    return DraftFestivalActivity.build(builder);
  }

  public changeSecuritySection(
    securityUpdate: PrepareSecurityForm,
  ): DraftFestivalActivity {
    const security = { ...this.security, ...securityUpdate };

    const builder = { ...this.json, security };
    return DraftFestivalActivity.build(builder);
  }

  public changeSupplySection(
    supplyUpdate: PrepareSupplyForm,
  ): DraftFestivalActivity {
    const supply = { ...this.supply, ...supplyUpdate };

    const builder = { ...this.json, supply };
    return DraftFestivalActivity.build(builder);
  }
}
