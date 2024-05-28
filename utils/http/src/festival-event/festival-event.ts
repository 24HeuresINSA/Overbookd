import { FestivalActivity, FestivalEvent } from "@overbookd/festival-event";

export type Statistics<T extends FestivalEvent = FestivalActivity> = {
  teamCode: string;
  status: Record<T["status"], number>;
  total: number;
};
