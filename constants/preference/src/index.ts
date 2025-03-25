export const NO_PREF = "NO_PREF";
export const STACKED = "STACKED";
export const FRAGMENTED = "FRAGMENTED";
export const NO_REST = "NO_REST";

export const assignmentPreferences = [
  NO_PREF,
  STACKED,
  FRAGMENTED,
  NO_REST,
] as const;

export type AssignmentPreferenceType = (typeof assignmentPreferences)[number];

export function isAssignmentPreference(
  assignment: string,
): assignment is AssignmentPreferenceType {
  return assignmentPreferences.includes(assignment as AssignmentPreferenceType);
}
