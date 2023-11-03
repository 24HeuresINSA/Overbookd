import { Duration, IProvidePeriod } from "@overbookd/period";
import {
  AdherentNotFound,
  FestivalActivityNotFound,
} from "../festival-activity.error";
import {
  PrepareGeneralForm,
  PrepareInChargeForm,
  PrepareInChargeFormWithAdherent,
  PrepareSecurityForm,
  PrepareSignaForm,
  PrepareSupplyForm,
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

export interface Adherents {
  findById(id: number): Promise<Adherent | null>;
}

export interface PrepareFestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  save(activity: FestivalActivity): Promise<FestivalActivity>;
}

export type Prepare<T extends FestivalActivity> = {
  updateGeneral(general: PrepareGeneralForm): T;
  addGeneralTimeWindow(period: IProvidePeriod): T;
  removeGeneralTimeWindow(id: TimeWindow["id"]): T;
  updateInCharge(inCharge: PrepareInChargeForm): T;
  updateSigna(signa: PrepareSignaForm): T;
  updateSecurity(security: PrepareSecurityForm): T;
  updateSupply(supply: PrepareSupplyForm): T;
};

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: PrepareFestivalActivityRepository,
    private readonly adherents: Adherents,
  ) {}

  private getPrepareHelper(existingFA: FestivalActivity) {
    return isDraft(existingFA)
      ? PrepareDraftFestivalActivity.build(existingFA)
      : PrepareInReviewFestivalActivity.build(existingFA);
  }

  async updateGeneralSection(
    id: number,
    general: PrepareGeneralForm,
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
    inCharge: PrepareInChargeForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    let builder: PrepareInChargeFormWithAdherent = { ...inCharge };
    if (inCharge.adherentId) {
      const adherent = await this.adherents.findById(inCharge.adherentId);
      if (!adherent) throw new AdherentNotFound();
      builder = { ...builder, adherent };
    }

    const updatedFA = prepare.updateInCharge(builder);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSignaSection(
    id: number,
    signa: PrepareSignaForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSigna(signa);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSecuritySection(
    id: number,
    security: PrepareSecurityForm,
  ): Promise<FestivalActivity> {
    const existingFA = await this.findActivityIfExists(id);
    const prepare = this.getPrepareHelper(existingFA);

    const updatedFA = prepare.updateSecurity(security);
    return this.festivalActivities.save(updatedFA);
  }

  async updateSupplySection(
    id: number,
    supply: PrepareSupplyForm,
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

export function generateTimeWindowId(
  faId: number,
  period: IProvidePeriod,
): string {
  const { start, end } = period;
  const startMinutes = Duration.ms(start.getTime()).inMinutes;
  const endMinutes = Duration.ms(end.getTime()).inMinutes;

  return `${faId}-${startMinutes}-${endMinutes}`;
}
