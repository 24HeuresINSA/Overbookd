import {
  DEFAULT_PREFERENCE,
  type AssignmentPreference,
  type PlanningPreference,
  type Preference,
} from "@overbookd/http";
import type { PageURL } from "@overbookd/web-page";
import { PreferenceRepository } from "~/repositories/preference.repository";
import { isHttpError } from "~/utils/http/http-error.utils";
import type { Page } from "~/utils/navigation/pages/summary-pages";

type State = {
  myPreferences: Preference;
};

export const usePreferenceStore = defineStore("preference", {
  state: (): State => ({
    myPreferences: DEFAULT_PREFERENCE,
  }),
  getters: {
    isPageFavorite:
      (state) =>
      (page: Page): boolean => {
        return state.myPreferences.favoritePages.some(
          (favoritePage) => favoritePage === page.to,
        );
      },
  },
  actions: {
    async fetchMyPreferences() {
      const res = await PreferenceRepository.getMyPreferences();
      if (isHttpError(res)) return;
      this.myPreferences = res;
    },

    async updatePlanningPreference(preference: PlanningPreference) {
      const res =
        await PreferenceRepository.updatePlanningPreference(preference);
      if (isHttpError(res)) return;
      sendSuccessNotification("Ta préférence a été mise à jour");
      this.myPreferences.paperPlanning = res.paperPlanning;
    },

    async updateAssignmentPreference(preference: AssignmentPreference) {
      const res =
        await PreferenceRepository.updateAssignmentPreference(preference);
      if (isHttpError(res)) return;
      sendSuccessNotification("Ta préférence a été mise à jour");
      this.myPreferences.assignment = res.assignment;
    },

    async addPageToFavorites(page: PageURL) {
      const res = await PreferenceRepository.addPageToFavorites(page);
      if (isHttpError(res)) return;
      sendSuccessNotification("La page a été ajoutée à tes favoris");
      this.myPreferences.favoritePages = res.favoritePages;
    },

    async removePageFromFavorites(page: PageURL) {
      const res = await PreferenceRepository.removePageFromFavorites(page);
      if (isHttpError(res)) return;
      sendSuccessNotification("La page a été retirée de tes favoris");
      this.myPreferences.favoritePages = res.favoritePages;
    },
  },
});
