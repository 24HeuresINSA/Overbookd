import {
  FestivalActivity,
  LiteFestivalActivity,
} from "@overbookd/festival-activity";

export interface FestivalActivityRepository {
  findAll(): Promise<LiteFestivalActivity[]>;
  findById(id: number): Promise<FestivalActivity | null>;
}
