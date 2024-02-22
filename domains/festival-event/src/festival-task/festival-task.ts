import { PreviewFestivalActivity } from "../festival-activity/festival-activity";
import { Feedback } from "../common/feedback";
import { DRAFT, IN_REVIEW, REFUSED, VALIDATED } from "../common/status";
import { TimeWindow } from "../common/time-window";
import { InquiryRequest } from "../common/inquiry-request";
import { Location } from "../common/location";
import { KeyEvent } from "./festival-task.event";
import { DraftGeneral, General } from "./sections/general";
import { Mobilization, ReviewableMobilization } from "./sections/mobilizations";
import { DraftInstructions, Instructions } from "./sections/instructions";
import {
  InReviewReviews,
  RefusedReviews,
  ValidatedReviews,
} from "../common/review";
import { Adherent } from "../common/adherent";

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

type BaseDraft = {
  id: number;
  status: typeof DRAFT;
  general: DraftGeneral;
  festivalActivity: FestivalActivity;
  instructions: DraftInstructions;
  history: KeyEvent[];
  feedbacks: Feedback[];
  inquiries: InquiryRequest[];
};

type DraftWithConflicts = BaseDraft & {
  mobilizations: Mobilization[];
};

type DraftWithoutConflicts = BaseDraft & {
  mobilizations: Mobilization<{ withConflicts: false }>[];
};

export type Draft = DraftWithConflicts | DraftWithoutConflicts;

type MobilizationsWithoutConflicts = {
  mobilizations: ReviewableMobilization<{
    withConflicts: false;
  }>[];
};

type MobilizationsWithConflicts = {
  mobilizations: ReviewableMobilization[];
};

type BaseReviewable = {
  id: number;
  general: General;
  festivalActivity: FestivalActivity;
  instructions: Instructions;
  history: KeyEvent[];
  feedbacks: Feedback[];
  inquiries: InquiryRequest[];
  reviewer: Adherent;
};

type BaseInReview = BaseReviewable & {
  status: typeof IN_REVIEW;
  reviews: InReviewReviews<"FT">;
};

type BaseRefused = BaseReviewable & {
  status: typeof REFUSED;
  reviews: RefusedReviews<"FT">;
};

type BaseValidated = BaseReviewable & {
  status: typeof VALIDATED;
  reviews: ValidatedReviews<"FT">;
};

type GenerateConflictUnion<
  T extends BaseInReview | BaseRefused | BaseValidated,
> = (T & MobilizationsWithConflicts) | (T & MobilizationsWithoutConflicts);

export type InReview = GenerateConflictUnion<BaseInReview>;
export type Refused = GenerateConflictUnion<BaseRefused>;
export type Validated = GenerateConflictUnion<BaseValidated>;

export type Reviewable = InReview | Refused | Validated;

export type FestivalTask = Draft | Reviewable;

type GeneratePreview<T extends Reviewable> = {
  id: T["id"];
  status: T["status"];
  name: T["general"]["name"];
  administrator: T["general"]["administrator"];
  team: T["general"]["team"];
  reviews: T["reviews"];
};

export type PreviewDraft = {
  id: Draft["id"];
  status: Draft["status"];
  name: Draft["general"]["name"];
  administrator: Draft["general"]["administrator"];
  team: Draft["general"]["team"];
};

export type PreviewInReview = GeneratePreview<InReview>;
export type PreviewRefused = GeneratePreview<Refused>;

export type PreviewReviewable = PreviewInReview | PreviewRefused;

export type Preview = PreviewDraft | PreviewReviewable;
