export const REVIEWING = "REVIEWING";
export const NOT_ASKING_TO_REVIEW = "NOT_ASKING_TO_REVIEW";
export const APPROVED = "APPROVED";

export const communication = "communication";
export const humain = "humain";
export const signa = "signa";
export const secu = "secu";
export const matos = "matos";
export const elec = "elec";
export const barrieres = "barrieres";

export type PrivateActivityReviewer =
  | typeof humain
  | typeof signa
  | typeof secu
  | typeof matos
  | typeof elec
  | typeof barrieres;

export type PublicActivityReviewer =
  | PrivateActivityReviewer
  | typeof communication;

export type Reviewer = PublicActivityReviewer | PrivateActivityReviewer;

export type WaitingForReview = {
  id: number;
  name: string;
  reviewers: Reviewer[];
};

export type ReviewStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED;

export type ApprovalReviewStatus =
  | typeof APPROVED
  | typeof NOT_ASKING_TO_REVIEW;

export type InReviewReviews = Record<Reviewer, ReviewStatus>;
export type ValidatedReviews = Record<Reviewer, ApprovalReviewStatus>;

export type Reviews = InReviewReviews | ValidatedReviews;

const APPROVAL_REVIEWS = [APPROVED, NOT_ASKING_TO_REVIEW];

export function isValidatedReviews(
  reviews: Reviews,
): reviews is ValidatedReviews {
  return Object.values(reviews).every((review) =>
    APPROVAL_REVIEWS.includes(review),
  );
}
