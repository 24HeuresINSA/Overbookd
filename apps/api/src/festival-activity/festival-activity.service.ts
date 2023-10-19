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
  constructor(
    private readonly adherents: AdherentRepository,
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

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

  async saveGeneralSection(
    id: number,
    generalSection: Partial<GeneralSection>,
  ): Promise<FestivalActivity> {
    const festivalActivity = await this.findById(id);
    if (!festivalActivity) throw new Error("Festival activity not found");
    const prepareFestivalActivity = new PrepareFestivalActivity(
      this.festivalActivities,
    );
    const updatedFA = await prepareFestivalActivity.updateGeneralSection(
      id,
      generalSection,
    );
    return this.festivalActivities.save(updatedFA);
  }
}
