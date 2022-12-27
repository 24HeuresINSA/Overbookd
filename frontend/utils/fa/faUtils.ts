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

export function getFAValidationStatus(fa: FA, teamCode: string): Status {
  if (isAnimationValidatedBy(fa, teamCode)) return Status.VALIDATED;
  if (isAnimationRefusedBy(fa, teamCode)) return Status.REFUSED;
  if (fa.status === Status.SUBMITTED) return Status.SUBMITTED;
  return Status.DRAFT;
}
