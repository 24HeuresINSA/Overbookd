import type { PlanningPreference, Preference } from "@overbookd/http";
import type { PageURL } from "@overbookd/web-page";
import { PreferenceRepository } from "~/repositories/preference.repository";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  myPreferences: Preference | null;
};

export const usePreferenceStore = defineStore("preference", {
  state: (): State => ({
    myPreferences: null,
  }),
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
      sendSuccessNotification("Ta préférence a bien été mise à jour ✅");
      if (!this.myPreferences) return;
      this.myPreferences.paperPlanning = res.paperPlanning;
    },

    async addPageToFavorites(page: PageURL) {
      const res = await PreferenceRepository.addPageToFavorites(page);
      if (isHttpError(res)) return;
      sendSuccessNotification("La page a bien été ajoutée à tes favoris ✅");
      if (!this.myPreferences) return;
      this.myPreferences.favoritePages = res.favoritePages;
    },

    async removePageFromFavorites(page: PageURL) {
      const res = await PreferenceRepository.removePageFromFavorites(page);
      if (isHttpError(res)) return;
      sendSuccessNotification("La page a bien été retirée de tes favoris ✅");
      if (!this.myPreferences) return;
      this.myPreferences.favoritePages = res.favoritePages;
    },
  },
});
