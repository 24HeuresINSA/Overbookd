import { IProvidePeriod } from "@overbookd/period";
import { FestivalActivityNotFound } from "../festival-activity.error";
import {
  PrepareGeneralUpdate,
  PrepareInChargeUpdate,
  PrepareSecurityUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
} from "./prepare-festival-activity.model";
import {
  Adherent,
  FestivalActivity,
  PreviewFestivalActivity,
  TimeWindow,
  isDraft,
} from "../festival-activity";
import { PrepareInReviewFestivalActivity } from "./prepare-in-review-festival-activity";
import { PrepareDraftFestivalActivity } from "./prepare-draft-festival-activity";

export type Adherents = {
  find(id: number): Promise<Adherent | null>;
};

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
  updateSigna(signa: PrepareSignaUpdate): T;
  updateSecurity(security: PrepareSecurityUpdate): T;
  updateSupply(supply: PrepareSupplyUpdate): T;
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
    timeWindowId: string,
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

  private async findActivityIfExists(id: number): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    return existingFA;
  }
}
