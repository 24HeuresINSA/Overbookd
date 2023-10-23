import { Period } from "@overbookd/period";
import {
  InChargeSection,
  SecuritySection,
  SignaSection,
  SupplySection,
} from "../creation/draft-festival-activity.model";
import { GeneralSectionRepresentation } from "../creation/general-section";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { FestivalActivity, isDraft } from "../festival-activity.model";
import { FestivalActivityRepository } from "../festival-activity.repository";

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  async updateGeneralSection(
    id: number,
    general: Partial<GeneralSectionRepresentation>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    if (!isDraft(existingFA)) return existingFA;

    const updatedFA = existingFA.changeGeneralSection(general);

    return this.festivalActivities.save(updatedFA);
  }

  async addTimeWindowInGeneral(
    faId: number,
    period: Period,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(faId);
    if (!existingFA) throw new FestivalActivityNotFound(faId);

    const updatedFA = existingFA.addTimeWindowInGeneral(period);
    return this.festivalActivities.save(updatedFA);
  }

  async removeTimeWindowFromGeneral(
    faId: number,
    timeWindowId: string,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(faId);
    if (!existingFA) throw new FestivalActivityNotFound(faId);

    const updatedFA = existingFA.removeTimeWindowFromGeneral(timeWindowId);
    return this.festivalActivities.save(updatedFA);
  }

  async updateInChargeSection(
    id: number,
    inCharge: Partial<InChargeSection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    if (!isDraft(existingFA)) return existingFA;

    const updatedFA = existingFA.changeInChargeSection(inCharge);

    return this.festivalActivities.save(updatedFA);
  }

  async updateSignaSection(
    id: number,
    signa: Partial<SignaSection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    if (!isDraft(existingFA)) return existingFA;

    const updatedFA = existingFA.changeSignaSection(signa);

    return this.festivalActivities.save(updatedFA);
  }

  async updateSecuritySection(
    id: number,
    security: Partial<SecuritySection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    if (!isDraft(existingFA)) return existingFA;

    const updatedFA = existingFA.changeSecuritySection(security);

    return this.festivalActivities.save(updatedFA);
  }

  async updateSupplySection(
    id: number,
    supply: Partial<SupplySection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);
    if (!isDraft(existingFA)) return existingFA;

    const updatedFA = existingFA.changeSupplySection(supply);

    return this.festivalActivities.save(updatedFA);
  }
}
