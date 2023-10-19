import { Injectable } from "@nestjs/common";
import {
  FestivalActivity,
  FestivalActivityRepository,
  GeneralSection,
  PrepareFestivalActivity,
  PreviewFestivalActivity,
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
    generalSection: Partial<GeneralSection>,
  ): Promise<FestivalActivity> {
    return this.prepareFestivalActivity.updateGeneralSection(
      id,
      generalSection,
    );
  }
}
