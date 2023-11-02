import { DraftFestivalActivity } from "./preparation/draft-festival-activity";
import { FestivalActivityCreationForm } from "./creation/creation";
import { FestivalActivity, PreviewFestivalActivity } from "./festival-activity";

export interface FestivalActivityRepository {
  findAll(): Promise<PreviewFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
  create(form: FestivalActivityCreationForm): Promise<DraftFestivalActivity>;
  save<T extends FestivalActivity>(festivalActivity: T): Promise<T>;
}
