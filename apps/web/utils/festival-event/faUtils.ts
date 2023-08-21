import { Fa, FaRefuse, FaStatus, FaValidation } from '../models/fa';

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

export function getFAValidationStatus(fa: Fa, teamCode: string): FaStatus {
  if (fa.status === FaStatus.DRAFT) return FaStatus.DRAFT;
  if (isAnimationValidatedBy(fa, teamCode)) return FaStatus.VALIDATED;
  if (isAnimationRefusedBy(fa, teamCode)) return FaStatus.REFUSED;
  return FaStatus.SUBMITTED;
}

export function getFAValidationStatusWithMultipleTeams(
  fa: Fa,
  teamCodes: string[]
): FaStatus {
  if (fa.status === FaStatus.DRAFT) return FaStatus.DRAFT;
  if (hasAllValidations(fa, teamCodes)) return FaStatus.VALIDATED;
  if (hasAllRefusals(fa, teamCodes)) return FaStatus.REFUSED;
  return FaStatus.SUBMITTED;
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
