import { PreviewFestivalActivity } from "../festival-activity/festival-activity";
import { Feedback } from "../common/feedback";
import { DRAFT, IN_REVIEW } from "../common/status";
import { TimeWindow } from "../common/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { Location } from "../common/location";
import { KeyEvent } from "./festival-task.event";
import { DraftGeneral, General } from "./sections/general";
import { Mobilization, ReviewableMobilization } from "./sections/mobilizations";
import { DraftInstructions, Instructions } from "./sections/instructions";

export type FestivalActivity = {
  id: PreviewFestivalActivity["id"];
  name: PreviewFestivalActivity["name"];
  status: PreviewFestivalActivity["status"];
  location: Location | null;
  timeWindows: TimeWindow[];
  hasSupplyRequest: boolean;
  inquiry: {
    timeWindows: TimeWindow[];
    all: InquiryRequest[];
  };
};

export type FestivalTaskOptions = {
  withConflicts: boolean;
};

export const defaultFestivalTaskOptions = { withConflicts: true } as const;

export type Draft<
  Options extends FestivalTaskOptions = typeof defaultFestivalTaskOptions,
> = {
  id: number;
  status: typeof DRAFT;
  general: DraftGeneral;
  festivalActivity: FestivalActivity;
  instructions: DraftInstructions;
  history: KeyEvent[];
  feedbacks: Feedback[];
  mobilizations: Mobilization<Options>[];
  inquiries: InquiryRequest[];
};

export type Reviewable<
  Options extends FestivalTaskOptions = typeof defaultFestivalTaskOptions,
> = {
  id: number;
  status: typeof IN_REVIEW;
  general: General;
  festivalActivity: FestivalActivity;
  instructions: Instructions;
  history: KeyEvent[];
  feedbacks: Feedback[];
  mobilizations: ReviewableMobilization<Options>[];
  inquiries: InquiryRequest[];
};

export type FestivalTask<
  Options extends FestivalTaskOptions = typeof defaultFestivalTaskOptions,
> = Draft<Options>;

export type PreviewDraft = {
  id: Draft["id"];
  status: Draft["status"];
  name: Draft["general"]["name"];
  administrator: Draft["general"]["administrator"];
  team: Draft["general"]["team"];
};

export type Preview = PreviewDraft;
