import { IProvidePeriod } from "@overbookd/period";
import { FestivalActivityNotFound } from "../festival-activity.error";
import {
  LinkInquiryDrive,
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareInquiryRequestCreation,
  PrepareSignaUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSupplyUpdate,
} from "./prepare-festival-activity.model";
import {
  FestivalActivity,
  PreviewFestivalActivity,
  isDraft,
} from "../festival-activity";
import { InquiryRequest } from "../sections/inquiry";
import { ElectricitySupply } from "../sections/supply";
import { Signage } from "../sections/signa";
import { Contractor } from "../sections/in-charge";
import { TimeWindow } from "../sections/time-window";
import { PrepareInReviewFestivalActivity } from "./prepare-in-review-festival-activity";
import { PrepareDraftFestivalActivity } from "./prepare-draft-festival-activity";

export type PrepareFestivalActivityRepository = {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
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
  addSignage(signage: PrepareSignageCreation): T;
  updateSignage(signage: PrepareSignageUpdate): T;
  removeSignage(id: Signage["id"]): T;
  updateSecurity(security: FestivalActivity["security"]): T;
  updateSupply(supply: PrepareSupplyUpdate): T;
  addElectricitySupply(electricitySupply: PrepareElectricitySupplyCreation): T;
  updateElectricitySupply(electricitySupply: PrepareElectricitySupplyUpdate): T;
  removeElectricitySupply(electricitySupplyId: ElectricitySupply["id"]): T;
  addInquiryTimeWindow(period: IProvidePeriod): T;
  removeInquiryTimeWindow(id: TimeWindow["id"]): T;
  addInquiry(inquiry: PrepareInquiryRequestCreation): T;
  initInquiry(initializer: InitInquiry): T;
  removeInquiry(slug: InquiryRequest["slug"]): T;
  assignInquiryToDrive(link: LinkInquiryDrive): T;
};

export type InitInquiry = {
  timeWindow: IProvidePeriod;
  request: PrepareInquiryRequestCreation;
};

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: PrepareFestivalActivityRepository,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivities.findAll();
  }

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    return this.festivalActivities.findById(id);
  }

  private getPrepareHelper(existingFA: FestivalActivity) {
    return isDraft(existingFA)
      ? PrepareDraftFestivalActivity.build(existingFA)
      : PrepareInReviewFestivalActivity.build(existingFA);
  }

  async updateGeneralSection(
    id: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateGeneral(general);
    return this.festivalActivities.save(updatedFA);
  }

  async addTimeWindowInGeneral(
    faId: FestivalActivity["id"],
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addGeneralTimeWindow(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromGeneral(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeGeneralTimeWindow(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateInChargeSection(
    id: FestivalActivity["id"],
    inCharge: PrepareInChargeUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateInCharge(inCharge);
    return this.festivalActivities.save(updatedFA);
  }

  async addContractor(
    faId: FestivalActivity["id"],
    contractor: PrepareContractorCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addContractor(contractor);
    return this.festivalActivities.save(updatedFA);
  }

  async updateContractor(
    faId: FestivalActivity["id"],
    contractor: PrepareContractorUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateContractor(contractor);
    return this.festivalActivities.save(updatedFA);
  }

  async removeContractor(
    faId: FestivalActivity["id"],
    contractorId: Contractor["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeContractor(contractorId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSignaSection(
    id: FestivalActivity["id"],
    signa: PrepareSignaUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSigna(signa);
    return this.festivalActivities.save(updatedFA);
  }

  async addSignage(
    faId: FestivalActivity["id"],
    signage: PrepareSignageCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addSignage(signage);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSignage(
    faId: FestivalActivity["id"],
    signage: PrepareSignageUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSignage(signage);
    return this.festivalActivities.save(updatedFA);
  }

  async removeSignage(
    faId: FestivalActivity["id"],
    signageId: Signage["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeSignage(signageId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSecuritySection(
    id: FestivalActivity["id"],
    security: FestivalActivity["security"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSecurity(security);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSupplySection(
    id: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSupply(supply);
    return this.festivalActivities.save(updatedFA);
  }

  async addElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupply: PrepareElectricitySupplyCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addElectricitySupply(electricitySupply);
    return this.festivalActivities.save(updatedFA);
  }

  async updateElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupply: PrepareElectricitySupplyUpdate,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateElectricitySupply(electricitySupply);
    return this.festivalActivities.save(updatedFA);
  }

  async removeElectricitySupply(
    faId: FestivalActivity["id"],
    electricitySupplyId: ElectricitySupply["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeElectricitySupply(electricitySupplyId);
    return this.festivalActivities.save(updatedFA);
  }

  async initInquiry(
    faId: FestivalActivity["id"],
    inquiryInitializer: InitInquiry,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.initInquiry(inquiryInitializer);
    return this.festivalActivities.save(updatedFA);
  }

  async addTimeWindowInInquiry(
    faId: FestivalActivity["id"],
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addInquiryTimeWindow(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromInquiry(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeInquiryTimeWindow(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async addInquiryRequest(
    faId: FestivalActivity["id"],
    inquiry: PrepareInquiryRequestCreation,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.addInquiry(inquiry);
    return this.festivalActivities.save(updatedFA);
  }

  async removeInquiryRequest(
    faId: FestivalActivity["id"],
    slug: InquiryRequest["slug"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeInquiry(slug);
    return this.festivalActivities.save(updatedFA);
  }

  private async findActivityIfExists(
    id: FestivalActivity["id"],
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    return existingFA;
  }

  async assignInquiryToDrive(
    faId: FestivalActivity["id"],
    link: LinkInquiryDrive,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.assignInquiryToDrive(link);
    return this.festivalActivities.save(updatedFA);
  }
}
