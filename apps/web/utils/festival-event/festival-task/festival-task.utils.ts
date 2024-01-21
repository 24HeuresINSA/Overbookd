import { FestivalTask } from "@overbookd/festival-event";
import { HttpStringified } from "@overbookd/http";
import { CastDraft } from "./draft";

export function castTaskWithDate(
  activity: HttpStringified<FestivalTask>,
): FestivalTask {
  return CastDraft.withDate(activity);
}
