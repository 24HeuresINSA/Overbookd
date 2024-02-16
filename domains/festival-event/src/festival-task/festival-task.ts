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
import { InReviewReviews } from "../common/review";

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

type FestivalTaskOptions = {
  withConflicts: boolean;
};

const defaultFestivalTaskOptions = { withConflicts: true } as const;

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

export type InReview<
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
  reviews: InReviewReviews<"FT">;
};

export type FestivalTask<
  Options extends FestivalTaskOptions = typeof defaultFestivalTaskOptions,
> = Draft<Options> | InReview<Options>;

export type PreviewDraft = {
  id: Draft["id"];
  status: Draft["status"];
  name: Draft["general"]["name"];
  administrator: Draft["general"]["administrator"];
  team: Draft["general"]["team"];
};

export type PreviewInReview = {
  id: InReview["id"];
  status: InReview["status"];
  name: InReview["general"]["name"];
  administrator: InReview["general"]["administrator"];
  team: InReview["general"]["team"];
  reviews: InReview["reviews"];
};

export type Preview = PreviewDraft | PreviewInReview;

export function isDraft<Options extends FestivalTaskOptions>(
  task: FestivalTask<Options>,
): task is Draft<Options> {
  return task.status === DRAFT;
}
