import { DraftFestivalActivity } from "./draft-festival-activity";
import { CreateFestivalActivity } from "./creation/creation";
import {
  PreviewFestivalActivity,
  FestivalActivity,
} from "./festival-activity.model";

export interface FestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  create(form: CreateFestivalActivity): Promise<DraftFestivalActivity>;
  save<T extends FestivalActivity>(festivalActivity: T): Promise<T>;
}
