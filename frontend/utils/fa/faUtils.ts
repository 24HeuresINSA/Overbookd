import { FA, fa_refuse, fa_validation, Status } from "../models/FA";

export function isAnimationValidatedBy(fa: FA, teamCode: string): boolean {
  return (fa.fa_validation ?? []).some(
    (validation: fa_validation) => validation.Team.code === teamCode
  );
}

export function isAnimationRefusedBy(fa: FA, teamCode: string): boolean {
  return (fa.fa_refuse ?? []).some(
    (refuse: fa_refuse) => refuse.Team.code === teamCode
  );
}

export function getFAValidationStatus(fa: FA, teamCode: string): Status {
  if (fa.status === Status.DRAFT) return Status.DRAFT;
  if (isAnimationValidatedBy(fa, teamCode)) return Status.VALIDATED;
  if (isAnimationRefusedBy(fa, teamCode)) return Status.REFUSED;
  return Status.SUBMITTED;
}

export function getFAValidationStatusWithMultipleTeams(
  fa: FA,
  teamCodes: string[]
): Status {
  if (fa.status === Status.DRAFT) return Status.DRAFT;
  if (hasAllValidations(fa, teamCodes)) return Status.VALIDATED;
  if (hasAllRefusals(fa, teamCodes)) return Status.REFUSED;
  return Status.SUBMITTED;
}

export function hasAtLeastOneValidation(fa: FA, teamCodes: string[]): boolean {
  return teamCodes.some((code) => isAnimationValidatedBy(fa, code));
}

export function hasAtLeastOneRefusal(fa: FA, teamCodes: string[]): boolean {
  return teamCodes.some((code) => isAnimationRefusedBy(fa, code));
}

export function hasAllValidations(fa: FA, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isAnimationValidatedBy(fa, code));
}

export function hasAllRefusals(fa: FA, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isAnimationRefusedBy(fa, code));
}
