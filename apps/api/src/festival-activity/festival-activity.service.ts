import { Injectable } from "@nestjs/common";
import {
  FestivalActivity,
  FestivalActivityRepository,
  GeneralSection,
  PrepareFestivalActivity,
  PrepareInChargeSection,
  PreviewFestivalActivity,
  SecuritySection,
  SignaSection,
  SupplySection,
} from "@overbookd/festival-activity";
import { AdherentRepository } from "./repository/adherent-repository.prisma";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

@Injectable()
export class FestivalActivityService {
  private prepareFestivalActivity: PrepareFestivalActivity;

  constructor(
    private readonly adherents: AdherentRepository,
    private readonly festivalActivities: FestivalActivityRepository,
  ) {
    this.prepareFestivalActivity = new PrepareFestivalActivity(
      this.festivalActivities,
    );
  }

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivities.findAll();
  }

  findById(id: number): Promise<FestivalActivity | null> {
    return this.festivalActivities.findById(id);
  }

  async create({ id }: JwtPayload, name: string): Promise<FestivalActivity> {
    const author = await this.adherents.find(id);
    return this.festivalActivities.create({ author, name });
  }

  saveGeneralSection(
    id: number,
    general: Partial<GeneralSection>,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateGeneralSection(id, general);
  }

  async saveInChargeSection(
    id: number,
    inCharge: PrepareInChargeSection,
  ): Promise<FestivalActivity> {
    const adherent = inCharge.adherentId
      ? { adherent: await this.adherents.find(inCharge.adherentId) }
      : {};
    const builder = { ...inCharge, ...adherent };
    return this.prepareFestivalActivity.updateInChargeSection(id, builder);
  }

  saveSignaSection(
    id: number,
    signa: Partial<SignaSection>,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSignaSection(id, signa);
  }

  saveSecuritySection(
    id: number,
    security: Partial<SecuritySection>,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSecuritySection(id, security);
  }

  saveSupplySection(
    id: number,
    supply: Partial<SupplySection>,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSupplySection(id, supply);
  }
}
