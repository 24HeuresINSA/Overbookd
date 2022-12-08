import { fa_refuse, fa_validation, Status } from "../models/FA";

export function isAnimationValidatedBy(
  mFA: any,
  value: string | null
): boolean {
  return mFA.fa_validation?.some(
    (validation: fa_validation) => validation.Team.code === value
  );
}

export function isAnimationRefusedBy(mFA: any, value: string | null): boolean {
  return mFA.fa_refuse?.some((refuse: fa_refuse) => refuse.Team.code === value);
}

export function getCardColor(mFA: any, value: string | null): string {
  if (isAnimationValidatedBy(mFA, value)) return "green-border";
  if (isAnimationRefusedBy(mFA, value)) return "red-border";
  if (mFA.status === Status.SUBMITTED) return "orange-border";
  return "";
}

export interface faValidationRulesData {
  rules: Record<string, (mFA: any, value: string | null) => string | boolean>;
}
