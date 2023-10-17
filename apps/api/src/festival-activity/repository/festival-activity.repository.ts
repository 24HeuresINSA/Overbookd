import {
  CreateFestivalActivity,
  DraftFestivalActivity,
  FestivalActivity,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";

export interface FestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  create(form: CreateFestivalActivity): Promise<DraftFestivalActivity>;
  save(festivalActivity: FestivalActivity): Promise<FestivalActivity>;
}
