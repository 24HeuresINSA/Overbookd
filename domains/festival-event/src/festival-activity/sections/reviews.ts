import { APPROVED, REJECTED } from "../../common/action";
import {
  InReviewReviews,
  ValidatedReviews,
  RefusedReviews,
} from "../../common/review";
import { NOT_ASKING_TO_REVIEW } from "../../common/review";

export type Reviews =
  | InReviewReviews<"FA">
  | ValidatedReviews<"FA">
  | RefusedReviews<"FA">;

const APPROVAL_REVIEWS = [APPROVED, NOT_ASKING_TO_REVIEW];

export function isValidatedReviews(
  reviews: Reviews,
): reviews is ValidatedReviews<"FA"> {
  return Object.values(reviews).every((review) =>
    APPROVAL_REVIEWS.includes(review),
  );
}

export function isRefusedReviews(
  reviews: Reviews,
): reviews is RefusedReviews<"FA"> {
  return Object.values(reviews).some((review) => review === REJECTED);
}
