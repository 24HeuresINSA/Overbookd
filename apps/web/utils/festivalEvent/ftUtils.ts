import { FT, FTStatus } from "../models/ft";
import { Review, ReviewStatus } from "../models/review";

export function isTaskValidatedBy(
  reviews: Review[],
  teamCode: string
): boolean {
  const validationReviews = getValidationReviews(reviews);
  return validationReviews.some((review) => review.team.code === teamCode);
}

export function isTaskRefusedBy(reviews: Review[], teamCode: string): boolean {
  const refusalReviews = getRefusalReviews(reviews);
  return refusalReviews.some((review) => review.team.code === teamCode);
}

export function getFTValidationStatus(ft: FT, teamCode: string): FTStatus {
  if (ft.status === FTStatus.DRAFT) return FTStatus.DRAFT;
  if (isTaskValidatedBy(ft.reviews, teamCode)) return FTStatus.VALIDATED;
  if (isTaskRefusedBy(ft.reviews, teamCode)) return FTStatus.REFUSED;
  return FTStatus.SUBMITTED;
}

export function getFTValidationStatusWithMultipleTeams(
  ft: FT,
  teamCodes: string[]
): FTStatus {
  if (ft.status === FTStatus.DRAFT) return FTStatus.DRAFT;
  if (hasAllFTValidations(ft.reviews, teamCodes)) return FTStatus.VALIDATED;
  if (hasAllFTRefusals(ft.reviews, teamCodes)) return FTStatus.REFUSED;
  return FTStatus.SUBMITTED;
}

export function hasAtLeastOneFTValidation(
  reviews: Review[],
  teamCodes: string[]
): boolean {
  return teamCodes.some((code) => isTaskValidatedBy(reviews, code));
}

export function hasAtLeastOneFTRefusal(
  reviews: Review[],
  teamCodes: string[]
): boolean {
  return teamCodes.some((code) => isTaskRefusedBy(reviews, code));
}

export function hasAllFTValidations(
  reviews: Review[],
  teamCodes: string[]
): boolean {
  return teamCodes.every((code) => isTaskValidatedBy(reviews, code));
}

export function hasAllFTRefusals(
  reviews: Review[],
  teamCodes: string[]
): boolean {
  return teamCodes.every((code) => isTaskRefusedBy(reviews, code));
}

export function getValidationReviews(reviews: Review[]): Review[] {
  return reviews.filter((r) => r.status === ReviewStatus.VALIDATED);
}

export function getRefusalReviews(reviews: Review[]): Review[] {
  return reviews.filter((r) => r.status === ReviewStatus.REFUSED);
}
