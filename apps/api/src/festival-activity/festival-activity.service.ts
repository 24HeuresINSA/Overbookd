import { Injectable } from "@nestjs/common";
import { FestivalActivityRepository } from "./repository/festival-activity.repository";
import {
  FestivalActivity,
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

  save(festivalActivity: FestivalActivity): Promise<FestivalActivity> {
    return this.festivalActivities.save(festivalActivity);
  }
}
