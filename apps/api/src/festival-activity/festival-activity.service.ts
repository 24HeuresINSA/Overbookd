import { Injectable } from "@nestjs/common";
import {
  Adherent,
  CreateFestivalActivity,
  Draft,
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareGeneralUpdate,
  PrepareSignaUpdate,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";

export type PrepareInChargeForm = {
  adherentId?: number;
  team?: string;
};

export type Adherents = {
  find(id: number): Promise<Adherent | null>;
};

@Injectable()
export class FestivalActivityService {
  constructor(
    private readonly adherents: Adherents,
    private readonly createFestivalActivity: CreateFestivalActivity,
    private readonly prepareFestivalActivity: PrepareFestivalActivity,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.prepareFestivalActivity.findAll();
  }

  findById(id: number): Promise<FestivalActivity | null> {
    return this.prepareFestivalActivity.findById(id);
  }

  async create({ id }: JwtPayload, name: string): Promise<Draft> {
    const author = await this.adherents.find(id);
    return this.createFestivalActivity.create({ author, name });
  }

  saveGeneralSection(
    id: number,
    general: PrepareGeneralUpdate,
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

    return this.prepareFestivalActivity.updateInChargeSection(id, {
      ...inCharge,
      ...adherent,
    });
  }

  saveSignaSection(
    id: number,
    signa: PrepareSignaUpdate,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSignaSection(id, signa);
  }

  saveSecuritySection(
    id: number,
    security: FestivalActivity["security"],
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSecuritySection(id, security);
  }

  saveSupplySection(
    id: number,
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSupplySection(id, supply);
  }
}
