import { Injectable } from "@nestjs/common";
import {
  CreateFestivalActivity,
  CreateFestivalActivityRepository,
  Draft,
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareFestivalActivityRepository,
  PrepareGeneralForm,
  PrepareInChargeForm,
  PrepareSecurityForm,
  PrepareSignaForm,
  PrepareSupplyForm,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { AdherentRepository } from "./repository/adherent-repository.prisma";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

@Injectable()
export class FestivalActivityService {
  private readonly createFestivalActivity: CreateFestivalActivity;
  private readonly prepareFestivalActivity: PrepareFestivalActivity;

  constructor(
    private readonly adherents: AdherentRepository,
    createFestivalActivities: CreateFestivalActivityRepository,
    private readonly prepareFestivalActivities: PrepareFestivalActivityRepository,
  ) {
    this.createFestivalActivity = new CreateFestivalActivity(
      createFestivalActivities,
    );
    this.prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  }

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.prepareFestivalActivities.findAll();
  }

  findById(id: number): Promise<FestivalActivity | null> {
    return this.prepareFestivalActivities.findById(id);
  }

  async create({ id }: JwtPayload, name: string): Promise<Draft> {
    const author = await this.adherents.find(id);
    return this.createFestivalActivity.create({ author, name });
  }

  saveGeneralSection(
    id: number,
    general: PrepareGeneralForm,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateGeneralSection(id, general);
  }

  async saveInChargeSection(
    id: number,
    inCharge: PrepareInChargeForm,
  ): Promise<FestivalActivity> {
    const adherent = inCharge.adherentId
      ? { adherent: await this.adherents.find(inCharge.adherentId) }
      : {};
    const builder = { ...inCharge, ...adherent };
    return this.prepareFestivalActivity.updateInChargeSection(id, builder);
  }

  saveSignaSection(
    id: number,
    signa: PrepareSignaForm,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSignaSection(id, signa);
  }

  saveSecuritySection(
    id: number,
    security: PrepareSecurityForm,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSecuritySection(id, security);
  }

  saveSupplySection(
    id: number,
    supply: PrepareSupplyForm,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSupplySection(id, supply);
  }
}
