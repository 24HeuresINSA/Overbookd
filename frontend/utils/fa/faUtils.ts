import { FA, fa_refuse, fa_validation, Status } from "../models/FA";

export function isAnimationValidatedBy(fa: FA, teamCode: string): boolean {
  return Boolean(
    fa.fa_validation?.some(
      (validation: fa_validation) => validation.Team.code === teamCode
    )
  );
}

export function isAnimationRefusedBy(fa: FA, teamCode: string): boolean {
  return Boolean(
    fa.fa_refuse?.some((refuse: fa_refuse) => refuse.Team.code === teamCode)
  );
}

export function getFAValidationStatus(
  fa: FA,
  teamCode: string | string[]
): Status {
  if (fa.status === Status.DRAFT) return Status.DRAFT;

  if (Array.isArray(teamCode)) {
    if (teamCode.every((code) => isAnimationValidatedBy(fa, code))) {
      return Status.VALIDATED;
    }
    if (teamCode.some((code) => isAnimationRefusedBy(fa, code))) {
      return Status.REFUSED;
    }
  } else {
    if (isAnimationValidatedBy(fa, teamCode)) return Status.VALIDATED;
    if (isAnimationRefusedBy(fa, teamCode)) return Status.REFUSED;
  }

  return Status.SUBMITTED;
}

export function hasAtLeastOneValidation(fa: FA, teamCodes: string[]): boolean {
  return teamCodes.some((code) => isAnimationValidatedBy(fa, code));
}
