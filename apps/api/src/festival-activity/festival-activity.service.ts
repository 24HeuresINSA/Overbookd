import { Injectable } from "@nestjs/common";
import { FestivalActivityRepository } from "./repository/festival-activity.repository";
import {
  FestivalActivity,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";

@Injectable()
export class FestivalActivityService {
  constructor(
    private readonly festivalActivities: FestivalActivityRepository,
  ) {}

  findAll(): Promise<PreviewFestivalActivity[]> {
    return this.festivalActivities.findAll();
  }

  findById(id: number): Promise<FestivalActivity | null> {
    return this.festivalActivities.findById(id);
  }

  save(festivalActivity: FestivalActivity): Promise<FestivalActivity> {
    return this.festivalActivities.save(festivalActivity);
  }
}
