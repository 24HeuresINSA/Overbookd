import { AssignmentPreferenceType, NO_PREF } from "@overbookd/preference";
import { PageURL } from "@overbookd/web-page";

export type PlanningPreference = {
  paperPlanning: boolean | null;
};

export type AssignmentPreference = {
  assignment: AssignmentPreferenceType;
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
