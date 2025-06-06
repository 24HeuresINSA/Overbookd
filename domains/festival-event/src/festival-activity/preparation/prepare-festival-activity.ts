import { IProvidePeriod } from "@overbookd/time";
import { FestivalActivityNotFound } from "../festival-activity.error.js";
import {
  LinkInquiryDrive,
  LinkSignageCatalogItem,
  PrepareContractorCreation,
  PrepareContractorUpdate,
  PrepareElectricitySupplyCreation,
  PrepareElectricitySupplyUpdate,
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareInquiryRequestCreation,
  PrepareInquiryRequestRemoving,
  PrepareInquiryRequestUpdating,
  PrepareSecurityUpdate,
  PrepareSignaUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSupplyUpdate,
} from "./prepare-festival-activity.model.js";
import { FestivalActivity } from "../festival-activity.js";
import { PreviewFestivalActivity } from "../festival-activity.js";
import { ElectricitySupply } from "../sections/supply.js";
import { Signage } from "../sections/signa.js";
import { Contractor } from "../sections/in-charge.js";
import { Adherent } from "../../common/adherent.js";
import { TimeWindow } from "../../common/time-window.js";
import { PrepareInReviewFestivalActivity } from "./prepare-in-review-festival-activity.js";
import { PrepareDraftFestivalActivity } from "./prepare-draft-festival-activity.js";
import { isDraft } from "../../festival-event.js";

export type PrepareFestivalActivityRepository = {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null>;
  save(activity: FestivalActivity): Promise<FestivalActivity>;
};

export type Prepare<T extends FestivalActivity> = {
  updateGeneral(general: PrepareGeneralUpdate): T;
  addGeneralTimeWindow(period: IProvidePeriod): T;
  updateGeneralTimeWindow(id: TimeWindow["id"], period: IProvidePeriod): T;
  removeGeneralTimeWindow(id: TimeWindow["id"]): T;
  updateInCharge(inCharge: PrepareInChargeUpdate): T;
  addContractor(contractor: PrepareContractorCreation): T;
  updateContractor(contractor: PrepareContractorUpdate): T;
  removeContractor(id: Contractor["id"]): T;
  updateSigna(signa: PrepareSignaUpdate): T;
  addSignage(signage: PrepareSignageCreation): T;
  updateSignage(signage: PrepareSignageUpdate): T;
  removeSignage(id: Signage["id"]): T;
  linkSignageToCatalogItem(link: LinkSignageCatalogItem): T;
  updateSecurity(security: PrepareSecurityUpdate): T;
  updateSupply(supply: PrepareSupplyUpdate): T;
  addElectricitySupply(electricitySupply: PrepareElectricitySupplyCreation): T;
  updateElectricitySupply(electricitySupply: PrepareElectricitySupplyUpdate): T;
  removeElectricitySupply(electricitySupplyId: ElectricitySupply["id"]): T;
  addInquiryTimeWindow(period: IProvidePeriod): T;
  updateInquiryTimeWindow(id: TimeWindow["id"], period: IProvidePeriod): T;
  removeInquiryTimeWindow(id: TimeWindow["id"]): T;
  addInquiry(inquiry: PrepareInquiryRequestCreation): T;
  initInquiry(initializer: InitInquiry): T;
  updateInquiry(inquiry: PrepareInquiryRequestUpdating): T;
  removeInquiry(inquiry: PrepareInquiryRequestRemoving): T;
  assignInquiryToDrive(link: LinkInquiryDrive): T;
};

export type InitInquiry = {
  timeWindow: IProvidePeriod;
  request: PrepareInquiryRequestCreation;
};

type PublishFeedback = {
  author: Adherent;
  content: string;
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

  async updateTimeWindowInGeneral(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateGeneralTimeWindow(timeWindowId, period);
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
    security: PrepareSecurityUpdate,
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

  async clearInquiry(faId: FestivalActivity["id"]): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.clearInquiry();
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

  async updateTimeWindowInInquiry(
    faId: FestivalActivity["id"],
    timeWindowId: TimeWindow["id"],
    period: IProvidePeriod,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateInquiryTimeWindow(timeWindowId, period);
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

  async updateInquiryRequest(
    faId: FestivalActivity["id"],
    inquiry: PrepareInquiryRequestUpdating,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateInquiry(inquiry);
    return this.festivalActivities.save(updatedFA);
  }

  async removeInquiryRequest(
    faId: FestivalActivity["id"],
    inquiry: PrepareInquiryRequestRemoving,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.removeInquiry(inquiry);
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

  async linkSignageToCatalogItem(
    faId: FestivalActivity["id"],
    link: LinkSignageCatalogItem,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.linkSignageToCatalogItem(link);
    return this.festivalActivities.save(updatedFA);
  }

  async publishFeedback(
    faId: FestivalActivity["id"],
    { author, content }: PublishFeedback,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(faId);
    const feedback = { author, content, publishedAt: new Date() };
    const feedbacks = [...existingFA.feedbacks, feedback];

    const updatedFA = { ...existingFA, feedbacks };
    return this.festivalActivities.save(updatedFA);
  }
}
