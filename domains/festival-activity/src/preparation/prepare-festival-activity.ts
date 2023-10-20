import {
  GeneralSection,
  InChargeSection,
  SecuritySection,
  SignaSection,
  SupplySection,
} from "../creation/draft-festival-activity";
import { FestivalActivityNotFound } from "../festival-activity.error";
import { FestivalActivity } from "../festival-activity.model";
import { FestivalActivityRepository } from "../festival-activity.repository";

export class PrepareFestivalActivity {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  async updateGeneralSection(
    id: number,
    generalSection: Partial<GeneralSection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);

    const updatedFA = existingFA.changeGeneralSection(generalSection);

    return this.festivalActivities.save(updatedFA);
  }

  async updateInChargeSection(
    id: number,
    inChargeSection: Partial<InChargeSection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);

    const updatedFA = existingFA.changeInChargeSection(inChargeSection);

    return this.festivalActivities.save(updatedFA);
  }

  async updateSignaSection(
    id: number,
    signaSection: Partial<SignaSection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);

    const updatedFA = existingFA.changeSignaSection(signaSection);

    return this.festivalActivities.save(updatedFA);
  }

  async updateSecuritySection(
    id: number,
    securitySection: Partial<SecuritySection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);

    const updatedFA = existingFA.changeSecuritySection(securitySection);

    return this.festivalActivities.save(updatedFA);
  }

  async updateSupplySection(
    id: number,
    supplySection: Partial<SupplySection>,
  ): Promise<FestivalActivity> {
    const existingFA = await this.festivalActivities.findById(id);
    if (!existingFA) throw new FestivalActivityNotFound(id);

    const updatedFA = existingFA.changeSupplySection(supplySection);

    return this.festivalActivities.save(updatedFA);
  }
}
