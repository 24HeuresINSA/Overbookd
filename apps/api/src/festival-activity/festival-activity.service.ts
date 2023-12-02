import { Injectable } from "@nestjs/common";
import {
  Adherent,
  CreateFestivalActivity,
  Draft,
  Location,
  FestivalActivity,
  PrepareFestivalActivity,
  PrepareGeneralUpdate,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
  PrepareInChargeForm,
  PrepareSignaForm,
} from "@overbookd/festival-activity";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import { DomainEventService } from "../domain-event/domain-event.service";
import { FestivalActivity as FestivalActivityEvents } from "@overbookd/domain-events";

export type Adherents = {
  find(id: number): Promise<Adherent | null>;
};

export type Locations = {
  find(id: number): Promise<Location | null>;
};

@Injectable()
export class FestivalActivityService {
  constructor(
    private readonly adherents: Adherents,
    private readonly locations: Locations,
    private readonly createFestivalActivity: CreateFestivalActivity,
    private readonly prepareFestivalActivity: PrepareFestivalActivity,
    private readonly eventStore: DomainEventService,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.prepareFestivalActivity.findAll();
  }

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    return this.prepareFestivalActivity.findById(id);
  }

  async create({ id }: JwtPayload, name: string): Promise<Draft> {
    const author = await this.adherents.find(id);
    const created = await this.createFestivalActivity.create({
      author,
      name,
    });
    this.eventStore.publish(FestivalActivityEvents.created(created));
    return created.festivalActivity;
  }

  saveGeneralSection(
    id: FestivalActivity["id"],
    general: PrepareGeneralUpdate,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateGeneralSection(id, general);
  }

  async saveInChargeSection(
    id: FestivalActivity["id"],
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

  async saveSignaSection(
    id: FestivalActivity["id"],
    signa: PrepareSignaForm,
  ): Promise<FestivalActivity> {
    const location = signa.locationId
      ? await this.locations.find(signa.locationId)
      : null;

    return this.prepareFestivalActivity.updateSignaSection(id, { location });
  }

  saveSecuritySection(
    id: FestivalActivity["id"],
    security: FestivalActivity["security"],
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSecuritySection(id, security);
  }

  saveSupplySection(
    id: FestivalActivity["id"],
    supply: PrepareSupplyUpdate,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateSupplySection(id, supply);
  }
}
