import { Prepare } from "./prepare-festival-activity";

import { IProvidePeriod } from "@overbookd/period";
import {
  Contractor,
  ElectricitySupply,
  InReview,
  InquiryRequest,
  TimeWindow,
} from "../festival-activity";
import {
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareSignaUpdate,
  PrepareSecurityUpdate,
  PrepareSupplyUpdate,
  PrepareContractorCreation,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareContractorUpdate,
  PrepareInquiryRequestCreation,
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

  updateContractor(contractor: PrepareContractorUpdate): InReview {
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

  addElectricitySupply(
    electricitySupply: PrepareElectricitySupplyCreation,
  ): InReview {
    throw new Error("Method not implemented." + electricitySupply);
  }

  updateElectricitySupply(
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): InReview {
    throw new Error("Method not implemented." + electricitySupply);
  }

  removeElectricitySupply(
    electricitySupplyId: ElectricitySupply["id"],
  ): InReview {
    throw new Error("Method not implemented." + electricitySupplyId);
  }

  addInquiryTimeWindow(period: IProvidePeriod): InReview {
    throw new Error("Method not implemented." + period);
  }

  removeInquiryTimeWindow(id: string): InReview {
    throw new Error("Method not implemented." + id);
  }

  addGearInquiry(gear: PrepareInquiryRequestCreation): InReview {
    throw new Error("Method not implemented." + gear);
  }

  removeGearInquiry(id: InquiryRequest["id"]): InReview {
    throw new Error("Method not implemented." + id);
  }

  addBarrierInquiry(barrier: PrepareInquiryRequestCreation): InReview {
    throw new Error("Method not implemented." + barrier);
  }

  removeBarrierInquiry(id: InquiryRequest["id"]): InReview {
    throw new Error("Method not implemented." + id);
  }

  addElectricityInquiry(electricity: PrepareInquiryRequestCreation): InReview {
    throw new Error("Method not implemented." + electricity);
  }

  removeElectricityInquiry(id: InquiryRequest["id"]): InReview {
    throw new Error("Method not implemented." + id);
  }
}
