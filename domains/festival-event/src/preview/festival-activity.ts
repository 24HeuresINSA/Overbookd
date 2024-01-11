import { DRAFT } from "..";
import { Adherent } from "../common/adherent";
import { IN_REVIEW, REFUSED, VALIDATED } from "../common/status";
import {
  InReviewReviews,
  ValidatedReviews,
  RefusedReviews,
} from "../common/review";

type PreviewBase = {
  id: number;
  name: string;
  adherent: Adherent;
};

type PreviewReviewableBase = PreviewBase & {
  team: string;
};
type InReviewPreview = PreviewReviewableBase & {
  status: typeof IN_REVIEW;
  reviews: InReviewReviews<"FA">;
};
type ValidatedPreview = PreviewReviewableBase & {
  status: typeof VALIDATED;
  reviews: ValidatedReviews<"FA">;
};
type RefusedPreview = PreviewReviewableBase & {
  status: typeof REFUSED;
  reviews: RefusedReviews<"FA">;
};

export type PreviewReviewable =
  | InReviewPreview
  | ValidatedPreview
  | RefusedPreview;

export type PreviewDraft = PreviewBase & {
  status: typeof DRAFT;
  team: string | null;
};

export type PreviewFestivalActivity = PreviewReviewable | PreviewDraft;
