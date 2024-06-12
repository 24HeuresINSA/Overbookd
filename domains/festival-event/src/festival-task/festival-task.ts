import {
  DRAFT,
  IN_REVIEW,
  READY_TO_ASSIGN,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import { PreviewFestivalActivity } from "../festival-activity/festival-activity.js";
import { Feedback } from "../common/feedback.js";
import { TimeWindow } from "../common/time-window.js";
import { InquiryRequest } from "../common/inquiry-request.js";
import { Location } from "../common/location.js";
import { KeyEvent } from "./festival-task.event.js";
import { DraftGeneral, General } from "./sections/general.js";
import {
  Mobilization,
  MobilizationOptions,
  ReviewableMobilization,
} from "./sections/mobilizations.js";
import { DraftInstructions, Instructions } from "./sections/instructions.js";
import {
  InReviewReviews,
  RefusedReviews,
  ValidatedReviews,
} from "../common/review.js";
import { Adherent } from "../common/adherent.js";
import { type Category } from "@overbookd/festival-event-constants";

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
  mobilizations: Mobilization<{
    withConflicts: false;
    withAssignments: false;
  }>[];
};

export type Draft = DraftWithConflicts | DraftWithoutConflicts;

type AssignmentsOptions = Pick<MobilizationOptions, "withAssignments">;

const defaultAssignmentsOption = {
  withAssignments: false,
} as const;

type MobilizationsWithoutConflicts<T extends AssignmentsOptions> = {
  mobilizations: ReviewableMobilization<T & { withConflicts: false }>[];
};

type MobilizationsWithConflicts<T extends AssignmentsOptions> = {
  mobilizations: ReviewableMobilization<T & { withConflicts: true }>[];
};

export type Categorize = {
  category?: Category;
  topPriority: boolean;
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

type BaseReadyToAssign = BaseReviewable &
  Categorize & {
    status: typeof READY_TO_ASSIGN;
    reviews: ValidatedReviews<"FT">;
  };

type GenerateConflictUnion<
  T extends BaseInReview | BaseRefused | BaseValidated | BaseReadyToAssign,
  Options extends AssignmentsOptions = typeof defaultAssignmentsOption,
> =
  | (T & MobilizationsWithConflicts<Options>)
  | (T & MobilizationsWithoutConflicts<Options>);

export type InReview = GenerateConflictUnion<BaseInReview>;
export type Refused = GenerateConflictUnion<BaseRefused>;
export type Validated = GenerateConflictUnion<BaseValidated>;
export type ReadyToAssign = GenerateConflictUnion<
  BaseReadyToAssign,
  { withAssignments: true }
>;

export type Reviewable = InReview | Refused | Validated | ReadyToAssign;

export type FestivalTask = Draft | Reviewable;

type GeneratePreview<T extends Reviewable> = {
  id: T["id"];
  status: T["status"];
  name: T["general"]["name"];
  administrator: T["general"]["administrator"];
  team: T["general"]["team"];
  reviews: T["reviews"];
  reviewer: T["reviewer"];
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
export type PreviewValidated = GeneratePreview<Validated>;
export type PreviewReadyToAssign = GeneratePreview<ReadyToAssign>;

export type PreviewReviewable =
  | PreviewInReview
  | PreviewRefused
  | PreviewValidated
  | PreviewReadyToAssign;

export type Preview = PreviewDraft | PreviewReviewable;

export function isReadyToAssign(task: FestivalTask): task is ReadyToAssign {
  return task.status === READY_TO_ASSIGN;
}
