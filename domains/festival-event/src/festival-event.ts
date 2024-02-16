import { FestivalActivity } from "./festival-activity/festival-activity";
import { FestivalTask } from "./festival-task/festival-task";

export type FestivalEvent = FestivalActivity | FestivalTask;

export class FestivalEventError extends Error {}
