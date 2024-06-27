import type { Preference } from "@overbookd/http";
import { PreferenceRepository } from "~/repositories/preference.repository";
import { isHttpError } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

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

    async updateMyPreferences(preference: Preference) {
      const res = await PreferenceRepository.updateMyPreferences(preference);
      if (isHttpError(res)) return;
      sendNotification("Ta préférence a bien été mise à jour ✅");
      this.myPreferences = res;
    },
  },
});
