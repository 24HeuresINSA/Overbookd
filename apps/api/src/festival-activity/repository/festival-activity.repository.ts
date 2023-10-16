import {
  CreateFestivalActivity,
  FestivalActivity,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";

export interface FestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  create(form: CreateFestivalActivity): Promise<FestivalActivity>;
  save(festivalActivity: FestivalActivity): Promise<FestivalActivity>;
}
