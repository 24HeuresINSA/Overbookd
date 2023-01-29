import { FT, FTStatus } from "../models/ft";
import { Review, ReviewStatus } from "../models/review";
import { User } from "../models/user";

export function isTaskValidatedBy(
  reviews: Review[],
  teamCode: string
): boolean {
  const validationReviews = getValidationReviews(reviews);
  return validationReviews.some((review) => review.team.code === teamCode);
}

export function isTaskRefusedBy(reviews: Review[], teamCode: string): boolean {
  const refusalReviews = getValidationReviews(reviews);
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
  if (hasAllFTValidations(ft, teamCodes)) return FTStatus.VALIDATED;
  if (hasAllFTRefusals(ft, teamCodes)) return FTStatus.REFUSED;
  return FTStatus.SUBMITTED;
}

export function hasAtLeastOneFTValidation(
  ft: FT,
  teamCodes: string[]
): boolean {
  return teamCodes.some((code) => isTaskValidatedBy(ft.reviews, code));
}

export function hasAtLeastOneFTRefusal(ft: FT, teamCodes: string[]): boolean {
  return teamCodes.some((code) => isTaskRefusedBy(ft.reviews, code));
}

export function hasAllFTValidations(ft: FT, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isTaskValidatedBy(ft.reviews, code));
}

export function hasAllFTRefusals(ft: FT, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isTaskRefusedBy(ft.reviews, code));
}

export function getValidationReviews(reviews: Review[]): Review[] {
  return reviews.filter((r) => r.status === ReviewStatus.VALIDATED);
}

export function getRefusalReviews(reviews: Review[]): Review[] {
  return reviews.filter((r) => r.status === ReviewStatus.REFUSED);
}

export function shouldBeSwitchToSumbittedStatus(
  reviews: Review[],
  validator: User
): boolean {
  const refusalReviews = getRefusalReviews(reviews);
  return (
    refusalReviews.length === 1 && refusalReviews[0].team.id === validator.id
  );
}

export function shouldBeSwitchToValidatedStatus(
  reviews: Review[],
  maxValidators: number
): boolean {
  const validationReviews = getValidationReviews(reviews);
  // -1 car la validation est faite avant l'ajout du validateur
  return validationReviews.length === maxValidators - 1;
}
