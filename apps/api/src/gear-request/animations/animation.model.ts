import { FestivalActivity } from "@overbookd/festival-activity";

export interface Animation {
  id: number;
  name: string;
  status: FestivalActivity["status"];
}
