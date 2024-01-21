import { Ft, FtStatus } from "../../models/ft.model";
import { Review, ReviewStatus } from "../../models/review.model";

export function isTaskValidatedBy(
  reviews: Review[],
  teamCode: string,
): boolean {
  const validationReviews = getValidationReviews(reviews);
  return validationReviews.some((review) => review.team.code === teamCode);
}

export function isTaskRefusedBy(reviews: Review[], teamCode: string): boolean {
  const refusalReviews = getRefusalReviews(reviews);
  return refusalReviews.some((review) => review.team.code === teamCode);
}

export function getFTValidationStatus(ft: Ft, teamCode: string): FtStatus {
  if (ft.status === FtStatus.DRAFT) return FtStatus.DRAFT;
  if (isTaskValidatedBy(ft.reviews, teamCode)) return FtStatus.VALIDATED;
  if (isTaskRefusedBy(ft.reviews, teamCode)) return FtStatus.REFUSED;
  return FtStatus.SUBMITTED;
}

export function getFTValidationStatusWithMultipleTeams(
  ft: Ft,
  teamCodes: string[],
): FtStatus {
  if (ft.status === FtStatus.DRAFT) return FtStatus.DRAFT;
  if (hasAllFTValidations(ft.reviews, teamCodes)) return FtStatus.VALIDATED;
  if (hasAllFTRefusals(ft.reviews, teamCodes)) return FtStatus.REFUSED;
  return FtStatus.SUBMITTED;
}

export function hasAtLeastOneFTValidation(
  reviews: Review[],
  teamCodes: string[],
): boolean {
  return teamCodes.some((code) => isTaskValidatedBy(reviews, code));
}

export function hasAtLeastOneFTRefusal(
  reviews: Review[],
  teamCodes: string[],
): boolean {
  return teamCodes.some((code) => isTaskRefusedBy(reviews, code));
}

export function hasAllFTValidations(
  reviews: Review[],
  teamCodes: string[],
): boolean {
  return teamCodes.every((code) => isTaskValidatedBy(reviews, code));
}

export function hasAllFTRefusals(
  reviews: Review[],
  teamCodes: string[],
): boolean {
  return teamCodes.every((code) => isTaskRefusedBy(reviews, code));
}

export function getValidationReviews(reviews: Review[]): Review[] {
  return reviews.filter((r) => r.status === ReviewStatus.VALIDATED);
}

export function getRefusalReviews(reviews: Review[]): Review[] {
  return reviews.filter((r) => r.status === ReviewStatus.REFUSED);
}
