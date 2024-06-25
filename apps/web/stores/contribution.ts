import type { Adherent, PayContributionForm } from "@overbookd/contribution";
import { ContributionRepository } from "~/repositories/contribution.repository";
import { isHttpError } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  adherentsOutToDate: Adherent[];
};

export const useContributionStore = defineStore("contribution", {
  state: (): State => ({
    adherentsOutToDate: [],
  }),
  actions: {
    async fetchAdherentsOutToDate() {
      const res = await ContributionRepository.fetchAdherentsOutToDate();
      if (isHttpError(res)) return;
      this.adherentsOutToDate = res;
    },

    async payContribution(adherent: Adherent, amount: number) {
      const form: PayContributionForm = { adherentId: adherent.id, amount };
      const res = await ContributionRepository.payContribution(form);

      if (isHttpError(res)) return;
      sendNotification("La cotisation a été payée avec succès 💰");
      this.adherentsOutToDate = this.adherentsOutToDate.filter(
        ({ id }) => id !== adherent.id,
      );
    },
  },
});
