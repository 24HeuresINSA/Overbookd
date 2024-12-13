import { Reviewer } from "@overbookd/festival-event";
import { FestivalEventIdentifier } from "@overbookd/festival-event";
import { FestivalActivity, FestivalEvent } from "@overbookd/festival-event";

export type Statistics<T extends FestivalEvent = FestivalActivity> = {
  teamCode: string;
  status: Record<T["status"], number>;
  total: number;
};

export type ReviewRejection<T extends FestivalEventIdentifier> = {
  team: Reviewer<T>;
  reason: string;
};

export type ReviewApproval<T extends FestivalEventIdentifier> = {
  team: Reviewer<T>;
};
