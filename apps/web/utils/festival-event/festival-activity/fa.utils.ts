import { Fa, FaRefuse, FaValidation } from "../../models/fa.model";

export function isAnimationValidatedBy(fa: Fa, teamCode: string): boolean {
  return (fa.faValidation ?? []).some(
    (validation: FaValidation) => validation.team.code === teamCode,
  );
}

export function isAnimationRefusedBy(fa: Fa, teamCode: string): boolean {
  return (fa.faRefuse ?? []).some(
    (refuse: FaRefuse) => refuse.team.code === teamCode,
  );
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
