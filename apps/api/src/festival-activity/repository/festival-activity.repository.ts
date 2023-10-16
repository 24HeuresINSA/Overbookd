import {
  FestivalActivity,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";

export interface FestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  save(festivalActivity: FestivalActivity): Promise<FestivalActivity>;
}
