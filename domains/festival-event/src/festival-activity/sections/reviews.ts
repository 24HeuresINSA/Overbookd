import { APPROVED } from "../../common/action";
import { Reviews } from "../../common/review";
import { ValidatedReviews } from "../../common/review";
import { NOT_ASKING_TO_REVIEW } from "../../common/review";

const APPROVAL_REVIEWS = [APPROVED, NOT_ASKING_TO_REVIEW];

export function isValidatedReviews(
  reviews: Reviews<"FA">,
): reviews is ValidatedReviews<"FA"> {
  return Object.values(reviews).every((review) =>
    APPROVAL_REVIEWS.includes(review),
  );
}
