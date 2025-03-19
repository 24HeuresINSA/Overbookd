import { PageURL } from "@overbookd/web-page";

export type PlanningPreference = {
  paperPlanning: boolean | null;
};

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

export type AssignmentType = (typeof assignmentPreferences)[number];

export type AssignmentPreference = {
  assignment: AssignmentType;
};

export function isAssignmentType(
  assignment: string,
): assignment is AssignmentType {
  return assignmentPreferences.includes(assignment as AssignmentType);
}

export const assignmentTypeLabel: Record<AssignmentType, string> = {
  NO_PREF: "Pas de préférence",
  STACKED: "Planning regroupé",
  FRAGMENTED: "Planning aéré",
  NO_REST: "JE VEUX UN MAX DE CRÉNEAUX !",
};

export const assignmentTypeDetailedLabel: Record<AssignmentType, string> = {
  NO_PREF: assignmentTypeLabel.NO_PREF,
  STACKED: `${assignmentTypeLabel.STACKED} (créneaux bénévoles collés et grandes pauses)`,
  FRAGMENTED: `${assignmentTypeLabel.FRAGMENTED} (créneaux bénévoles espacés de petites pauses)`,
  NO_REST: `${assignmentTypeLabel.NO_REST} (Quand je dors pas, je suis bénévole)`,
};

export type PagesPreference = {
  favoritePages: PageURL[];
};

export type Preference = PlanningPreference &
  AssignmentPreference &
  PagesPreference;

export type AddPageToFavorites = {
  page: PageURL;
};

export const DEFAULT_PREFERENCE: Preference = {
  paperPlanning: null,
  assignment: NO_PREF,
  favoritePages: [],
};
