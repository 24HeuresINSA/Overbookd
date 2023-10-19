import { DraftFestivalActivity } from "./creation/draft-festival-activity";
import { CreateFestivalActivity } from "./creation/festival-activity.factory";
import {
  PreviewFestivalActivity,
  FestivalActivity,
} from "./festival-activity.model";

export interface FestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  create(form: CreateFestivalActivity): Promise<DraftFestivalActivity>;
  save(festivalActivity: FestivalActivity): Promise<FestivalActivity>;
}
