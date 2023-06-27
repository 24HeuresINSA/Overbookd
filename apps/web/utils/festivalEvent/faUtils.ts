import { Fa, FaRefuse, FaValidation, Status } from "../models/FA";

export function isAnimationValidatedBy(fa: Fa, teamCode: string): boolean {
  return (fa.faValidation ?? []).some(
    (validation: FaValidation) => validation.team.code === teamCode
  );
}

export function isAnimationRefusedBy(fa: Fa, teamCode: string): boolean {
  return (fa.faRefuse ?? []).some(
    (refuse: FaRefuse) => refuse.team.code === teamCode
  );
}

export function getFAValidationStatus(fa: Fa, teamCode: string): Status {
  if (fa.status === Status.DRAFT) return Status.DRAFT;
  if (isAnimationValidatedBy(fa, teamCode)) return Status.VALIDATED;
  if (isAnimationRefusedBy(fa, teamCode)) return Status.REFUSED;
  return Status.SUBMITTED;
}

export function getFAValidationStatusWithMultipleTeams(
  fa: Fa,
  teamCodes: string[]
): Status {
  if (fa.status === Status.DRAFT) return Status.DRAFT;
  if (hasAllValidations(fa, teamCodes)) return Status.VALIDATED;
  if (hasAllRefusals(fa, teamCodes)) return Status.REFUSED;
  return Status.SUBMITTED;
}

export function hasAtLeastOneValidation(fa: Fa, teamCodes: string[]): boolean {
  return teamCodes.some((code) => isAnimationValidatedBy(fa, code));
}

export function hasAtLeastOneRefusal(fa: Fa, teamCodes: string[]): boolean {
  return teamCodes.some((code) => isAnimationRefusedBy(fa, code));
}

export function hasAllValidations(fa: Fa, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isAnimationValidatedBy(fa, code));
}

export function hasAllRefusals(fa: Fa, teamCodes: string[]): boolean {
  return teamCodes.every((code) => isAnimationRefusedBy(fa, code));
}
