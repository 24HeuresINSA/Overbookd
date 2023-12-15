export const REVIEWING = "REVIEWING";
export const NOT_ASKING_TO_REVIEW = "NOT_ASKING_TO_REVIEW";
export const APPROVED = "APPROVED";
export const REJECTED = "REJECTED";

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

export const REVIEWERS: Reviewer[] = [
  humain,
  signa,
  secu,
  matos,
  elec,
  barrieres,
  communication,
];

export type WaitingForReview = {
  id: number;
  name: string;
  reviewers: Reviewer[];
};

export type ReviewingStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED;

export type ApprovalReviewStatus =
  | typeof APPROVED
  | typeof NOT_ASKING_TO_REVIEW;

export type RejectionReviewStatus =
  | typeof REVIEWING
  | typeof NOT_ASKING_TO_REVIEW
  | typeof APPROVED
  | typeof REJECTED;

export type ReviewStatus =
  | RejectionReviewStatus
  | ApprovalReviewStatus
  | ReviewingStatus;

export type InReviewReviews = Record<Reviewer, ReviewingStatus>;
export type ValidatedReviews = Record<Reviewer, ApprovalReviewStatus>;
export type RefusedReviews = Record<Reviewer, RejectionReviewStatus>;

export type Reviews = InReviewReviews | ValidatedReviews | RefusedReviews;

const APPROVAL_REVIEWS = [APPROVED, NOT_ASKING_TO_REVIEW];

export function isValidatedReviews(
  reviews: Reviews,
): reviews is ValidatedReviews {
  return Object.values(reviews).every((review) =>
    APPROVAL_REVIEWS.includes(review),
  );
}

export function isRefusedReviews(reviews: Reviews): reviews is RefusedReviews {
  return Object.values(reviews).some((review) => review === REJECTED);
}
