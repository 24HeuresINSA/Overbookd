import { IProvidePeriod } from "@overbookd/period";
import { FestivalActivityNotFound } from "../festival-activity.error";
import {
  BARRIER,
  ELECTRICITY,
  GEAR,
  InquiryCategory,
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareInquiryRequestCreation,
  PrepareSecurityUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
} from "./prepare-festival-activity.model";
import {
  Contractor,
  ElectricitySupply,
  FestivalActivity,
  InquiryRequest,
  PreviewFestivalActivity,
  TimeWindow,
  isDraft,
} from "../festival-activity";
import { PrepareInReviewFestivalActivity } from "./prepare-in-review-festival-activity";
import { PrepareDraftFestivalActivity } from "./prepare-draft-festival-activity";

export type PrepareFestivalActivityRepository = {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  save(activity: FestivalActivity): Promise<FestivalActivity>;
};

export type Prepare<T extends FestivalActivity> = {
  updateGeneral(general: PrepareGeneralUpdate): T;
  addGeneralTimeWindow(period: IProvidePeriod): T;
  removeGeneralTimeWindow(id: TimeWindow["id"]): T;
  updateInCharge(inCharge: PrepareInChargeUpdate): T;
  addContractor(contractor: PrepareContractorCreation): T;
  updateContractor(contractor: PrepareContractorUpdate): T;
  removeContractor(id: Contractor["id"]): T;
  updateSigna(signa: PrepareSignaUpdate): T;
  updateSecurity(security: PrepareSecurityUpdate): T;
  updateSupply(supply: PrepareSupplyUpdate): T;
  addElectricitySupply(electricitySupply: PrepareElectricitySupplyCreation): T;
  updateElectricitySupply(electricitySupply: PrepareElectricitySupplyUpdate): T;
  removeElectricitySupply(electricitySupplyId: ElectricitySupply["id"]): T;
  addInquiryTimeWindow(period: IProvidePeriod): T;
  removeInquiryTimeWindow(id: TimeWindow["id"]): T;
  addGearInquiry(gear: PrepareInquiryRequestCreation): T;
  removeGearInquiry(id: InquiryRequest["id"]): T;
  addBarrierInquiry(barrier: PrepareInquiryRequestCreation): T;
  removeBarrierInquiry(id: InquiryRequest["id"]): T;
  addElectricityInquiry(electricity: PrepareInquiryRequestCreation): T;
  removeElectricityInquiry(id: InquiryRequest["id"]): T;
};

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: PrepareFestivalActivityRepository,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivities.findAll();
  }

  findById(id: number): Promise<FestivalActivity | null> {
    return this.festivalActivities.findById(id);
  }

  private getPrepareHelper(existingFA: FestivalActivity) {
    return isDraft(existingFA)
      ? PrepareDraftFestivalActivity.build(existingFA)
      : PrepareInReviewFestivalActivity.build(existingFA);
  }

  async updateGeneralSection(
    id: number,
    general: PrepareGeneralUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateGeneral(general);
    return this.festivalActivities.save(updatedFA);
  }

  async addTimeWindowInGeneral(
    faId: number,
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addGeneralTimeWindow(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromGeneral(
    faId: number,
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeGeneralTimeWindow(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateInChargeSection(
    id: number,
    inCharge: PrepareInChargeUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateInCharge(inCharge);
    return this.festivalActivities.save(updatedFA);
  }

  async addContractor(
    faId: number,
    contractor: PrepareContractorCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addContractor(contractor);
    return this.festivalActivities.save(updatedFA);
  }

  async updateContractor(
    faId: number,
    contractor: PrepareContractorUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateContractor(contractor);
    return this.festivalActivities.save(updatedFA);
  }

  async removeContractor(
    faId: number,
    contractorId: Contractor["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeContractor(contractorId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSignaSection(
    id: number,
    signa: PrepareSignaUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSigna(signa);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSecuritySection(
    id: number,
    security: PrepareSecurityUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSecurity(security);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSupplySection(
    id: number,
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSupply(supply);
    return this.festivalActivities.save(updatedFA);
  }

  async addElectricitySupply(
    faId: number,
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addElectricitySupply(electricitySupply);
    return this.festivalActivities.save(updatedFA);
  }

  async updateElectricitySupply(
    faId: number,
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateElectricitySupply(electricitySupply);
    return this.festivalActivities.save(updatedFA);
  }

  async removeElectricitySupply(
    faId: number,
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeElectricitySupply(electricitySupplyId);
    return this.festivalActivities.save(updatedFA);
  }

  async addTimeWindowInInquiry(
    faId: number,
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addInquiryTimeWindow(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromInquiry(
    faId: number,
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeInquiryTimeWindow(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async addInquiryRequest(
    faId: number,
    inquiry: PrepareInquiryRequestCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA =
      inquiry.category === GEAR
        ? prepare.addGearInquiry(inquiry)
        : inquiry.category === BARRIER
        ? prepare.addBarrierInquiry(inquiry)
        : prepare.addElectricityInquiry(inquiry);

    return this.festivalActivities.save(updatedFA);
  }

  async removeInquiryRequest(
    faId: number,
    gearId: InquiryRequest["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const category = this.findInquiryCategoryById(gearId);
    const updatedFA =
      category === GEAR
        ? prepare.removeGearInquiry(gearId)
        : category === BARRIER
        ? prepare.removeBarrierInquiry(gearId)
        : prepare.removeElectricityInquiry(gearId);

    return this.festivalActivities.save(updatedFA);
  }

  private findInquiryCategoryById(
    inquiryId: InquiryRequest["id"],
  ): InquiryCategory {
    // id = faId-category-slug
    const category = inquiryId.split("-")[1];
    switch (category) {
      case "gear":
        return GEAR;
      case "barrier":
        return BARRIER;
      case "electricity":
        return ELECTRICITY;
      default:
        throw new Error(`Unknown category ${category}`);
    }
  }

  private async findActivityIfExists(id: number): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    return existingFA;
  }
}
