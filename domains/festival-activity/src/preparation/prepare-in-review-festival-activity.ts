import { Prepare } from "./prepare-festival-activity";

import { IProvidePeriod } from "@overbookd/period";
import { InReview, TimeWindow } from "../festival-activity";
import {
  PrepareGeneralForm,
  PrepareInChargeForm,
  PrepareSignaForm,
  PrepareSecurityForm,
  PrepareSupplyForm,
} from "./prepare-festival-activity.model";

export class PrepareInReviewFestivalActivity implements Prepare<InReview> {
  private constructor(private readonly activity: InReview) {}

  static build(activity: InReview): PrepareInReviewFestivalActivity {
    return new PrepareInReviewFestivalActivity(activity);
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
