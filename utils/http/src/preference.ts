import { PageURL } from "@overbookd/web-page";

export type PlanningPreference = {
  paperPlanning: boolean | null;
};

export const NO_PREF = "NO_PREF";
export const STACKED = "STACKED";
export const FRAGMENTED = "FRAGMENTED";
export const NO_REST = "NO_REST";

export const assignmentPreferences = [NO_PREF, STACKED, FRAGMENTED, NO_REST];

type AssignmentPreferences =
  | typeof NO_PREF
  | typeof STACKED
  | typeof FRAGMENTED
  | typeof NO_REST;

export type AssignmentPreference = {
  assignment: AssignmentPreferences;
};

export type PagesPreference = {
  favoritePages: PageURL[];
};

export type Preference = PlanningPreference &
  PagesPreference &
  AssignmentPreference;

export type AddPageToFavorites = {
  page: PageURL;
};

export const DEFAULT_PREFERENCE: Preference = {
  paperPlanning: null,
  assignment: NO_PREF,
  favoritePages: [],
};
