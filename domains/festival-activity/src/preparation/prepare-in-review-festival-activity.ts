import { Prepare } from "./prepare-festival-activity";

import { IProvidePeriod } from "@overbookd/period";
import { InReview, IN_REVIEW, TimeWindow } from "../festival-activity";
import {
  PrepareGeneralForm,
  PrepareInChargeForm,
  PrepareSignaForm,
  PrepareSecurityForm,
  PrepareSupplyForm,
} from "./prepare-festival-activity.model";

export class PrepareInReviewFestivalActivity
  implements InReview, Prepare<InReview>
{
  private constructor(
    public id: InReview["id"],
    public general: InReview["general"],
    public inCharge: InReview["inCharge"],
    public signa: InReview["signa"],
    public security: InReview["security"],
    public supply: InReview["supply"],
    public inquiry: InReview["inquiry"],
  ) {}

  get status(): typeof IN_REVIEW {
    return IN_REVIEW;
  }

  private get festivalActivity(): InReview {
    return {
      id: this.id,
      status: this.status,
      general: this.general,
      inCharge: this.inCharge,
      signa: this.signa,
      security: this.security,
      supply: this.supply,
      inquiry: this.inquiry,
    };
  }

  static build(activity: InReview): PrepareInReviewFestivalActivity {
    const { id, general, inCharge, signa, security, supply, inquiry } =
      activity;
    return new PrepareInReviewFestivalActivity(
      id,
      general,
      inCharge,
      signa,
      security,
      supply,
      inquiry,
    );
  }

  updateGeneral(general: PrepareGeneralForm): InReview {
    throw new Error("Method not implemented." + general);
  }

  addGeneralTimeWindow(period: IProvidePeriod): InReview {
    throw new Error("Method not implemented." + period);
  }

  removeGeneralTimeWindow(id: TimeWindow["id"]): InReview {
    throw new Error("Method not implemented." + id);
  }

  updateInCharge(inCharge: PrepareInChargeForm): InReview {
    throw new Error("Method not implemented." + inCharge);
  }

  updateSigna(signa: PrepareSignaForm): InReview {
    throw new Error("Method not implemented." + signa);
  }

  updateSecurity(security: PrepareSecurityForm): InReview {
    throw new Error("Method not implemented." + security);
  }

  updateSupply(supply: PrepareSupplyForm): InReview {
    throw new Error("Method not implemented." + supply);
  }
}
