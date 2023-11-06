import { Prepare } from "./prepare-festival-activity";

import { IProvidePeriod } from "@overbookd/period";
import { Contractor, InReview, TimeWindow } from "../festival-activity";
import {
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareSignaUpdate,
  PrepareSecurityUpdate,
  PrepareSupplyUpdate,
  PrepareContractorCreation,
} from "./prepare-festival-activity.model";

export class PrepareInReviewFestivalActivity implements Prepare<InReview> {
  private constructor(private readonly activity: InReview) {}

  static build(activity: InReview): PrepareInReviewFestivalActivity {
    return new PrepareInReviewFestivalActivity(activity);
  }

  updateGeneral(general: PrepareGeneralUpdate): InReview {
    throw new Error("Method not implemented." + general);
  }

  addGeneralTimeWindow(period: IProvidePeriod): InReview {
    throw new Error("Method not implemented." + period);
  }

  removeGeneralTimeWindow(timeWindowId: TimeWindow["id"]): InReview {
    throw new Error("Method not implemented." + timeWindowId);
  }

  updateInCharge(inCharge: PrepareInChargeUpdate): InReview {
    throw new Error("Method not implemented." + inCharge);
  }

  addContractor(contractor: PrepareContractorCreation): InReview {
    throw new Error("Method not implemented." + contractor);
  }

  updateContractor(contractor: Contractor): InReview {
    throw new Error("Method not implemented." + contractor);
  }

  removeContractor(contractorId: Contractor["id"]): InReview {
    throw new Error("Method not implemented." + contractorId);
  }

  updateSigna(signa: PrepareSignaUpdate): InReview {
    throw new Error("Method not implemented." + signa);
  }

  updateSecurity(security: PrepareSecurityUpdate): InReview {
    throw new Error("Method not implemented." + security);
  }

  updateSupply(supply: PrepareSupplyUpdate): InReview {
    throw new Error("Method not implemented." + supply);
  }
}
