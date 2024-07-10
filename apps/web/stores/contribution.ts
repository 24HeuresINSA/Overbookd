import type {
  Adherent,
  AdherentWithContribution,
  PayContributionForm,
} from "@overbookd/contribution";
import type { HttpStringified } from "@overbookd/http";
import { ContributionRepository } from "~/repositories/contribution.repository";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  adherentsOutToDate: Adherent[];
  validAdherents: AdherentWithContribution[];
};

export const useContributionStore = defineStore("contribution", {
  state: (): State => ({
    adherentsOutToDate: [],
    validAdherents: [],
  }),
  actions: {
    async fetchAdherentsOutToDate() {
      const res = await ContributionRepository.fetchAdherentsOutToDate();
      if (isHttpError(res)) return;
      this.adherentsOutToDate = res;
    },

    async fetchAdherentsWithValidContribution() {
      const res =
        await ContributionRepository.fetchAdherentsWithValidContribution();
      if (isHttpError(res)) return;
      this.validAdherents = res.map(castAdherentWithContributionWithDate);
    },

    async payContribution(adherent: Adherent, amount: number) {
      const form: PayContributionForm = { adherentId: adherent.id, amount };
      const res = await ContributionRepository.payContribution(form);

      if (isHttpError(res)) return;
      sendSuccessNotification("La cotisation a été payée avec succès 💰");
      this.adherentsOutToDate = this.adherentsOutToDate.filter(
        ({ id }) => id !== adherent.id,
      );
      this.fetchAdherentsWithValidContribution();
    },

    async editContribution(adherent: AdherentWithContribution, amount: number) {
      const res = await ContributionRepository.editContribution(
        adherent.id,
        adherent.edition,
        amount,
      );

      if (isHttpError(res)) return;
      sendSuccessNotification("La cotisation a été modifiée avec succès 💰");
      this.validAdherents = this.validAdherents.map((a) =>
        a.id === adherent.id ? { ...a, amount } : a,
      );
    },

    async removeContribution(adherent: AdherentWithContribution) {
      const res = await ContributionRepository.removeContribution(
        adherent.id,
        adherent.edition,
      );

      if (isHttpError(res)) return;
      sendSuccessNotification("La cotisation a été supprimée avec succès 💰");
      this.validAdherents = this.validAdherents.filter(
        ({ id }) => id !== adherent.id,
      );
      this.fetchAdherentsOutToDate();
    },
  },
});

function castAdherentWithContributionWithDate(
  adherent: HttpStringified<AdherentWithContribution>,
): AdherentWithContribution {
  return {
    ...adherent,
    paymentDate: new Date(adherent.paymentDate),
  };
}
