import { FT, FTStatus } from "../models/ft";
import { ReviewStatus } from "../models/review";

export function isTaskValidatedBy(ft: FT, teamCode: string): boolean {
  return (ft.reviews ?? []).some(
    (review) =>
      review.status === ReviewStatus.VALIDATED && review.team.code === teamCode
  );
}

export function isTaskRefusedBy(ft: FT, teamCode: string): boolean {
  return (ft.reviews ?? []).some(
    (review) =>
      review.status === ReviewStatus.REFUSED && review.team.code === teamCode
  );
}

export function getFTValidationStatus(ft: FT, teamCode: string): FTStatus {
  if (ft.status === FTStatus.DRAFT) return FTStatus.DRAFT;
  if (isTaskValidatedBy(ft, teamCode)) return FTStatus.VALIDATED;
  if (isTaskRefusedBy(ft, teamCode)) return FTStatus.REFUSED;
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
  return teamCodes.some((code) => isTaskValidatedBy(ft, code));
}

export function hasAtLeastOneFTRefusal(ft: FT, teamCodes: string[]): boolean {
  return teamCodes.some((code) => isTaskRefusedBy(ft, code));
}

export function hasAllFTValidations(ft: FT, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isTaskValidatedBy(ft, code));
}

export function hasAllFTRefusals(ft: FT, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isTaskRefusedBy(ft, code));
}
