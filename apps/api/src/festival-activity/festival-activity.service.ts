import { Injectable } from "@nestjs/common";
import { FestivalActivityRepository } from "./repository/festival-activity.repository";
import { LiteFestivalActivity } from "@overbookd/festival-activity";

@Injectable()
export class FestivalActivityService {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  findAll(): Promise<LiteFestivalActivity[]> {
    return this.festivalActivities.findAll();
  }
}
