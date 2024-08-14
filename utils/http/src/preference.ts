import { PageURL } from "@overbookd/web-page";

export type PlanningPreference = {
  paperPlanning: boolean | null;
};

export type PagesPreference = {
  favoritePages: PageURL[];
};

export type Preference = PlanningPreference & PagesPreference;

export type AddPageToFavorites = {
  page: PageURL;
};
