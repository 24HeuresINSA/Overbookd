import type {
  Adherent,
  AdherentWithContribution,
  ContributionType,
  PayContributionForm,
} from "@overbookd/contribution";
import type { HttpStringified } from "@overbookd/http";
import { ContributionRepository } from "~/repositories/contribution.repository";
import { CONTRIBUTION_TYPE_LABELS } from "~/utils/contribution/contribution.constant";
import { isHttpError } from "~/utils/http/http-error.utils";

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

    async payContribution(adherent: Adherent, type: ContributionType) {
      const form: PayContributionForm = { adherentId: adherent.id, type };
      const res = await ContributionRepository.payContribution(form);

      if (isHttpError(res)) return;
      sendSuccessNotification(
        `${adherent.firstName} a été ajouté·e en tant que ${CONTRIBUTION_TYPE_LABELS[type]} 💰`,
      );
      this.adherentsOutToDate = this.adherentsOutToDate.filter(
        ({ id }) => id !== adherent.id,
      );
      this.fetchAdherentsWithValidContribution();
    },

    async editContribution(
      adherent: AdherentWithContribution,
      type: ContributionType,
    ) {
      const res = await ContributionRepository.editContribution(
        adherent.id,
        adherent.edition,
        type,
      );

      if (isHttpError(res)) return;
      sendSuccessNotification(
        `La cotisation de ${adherent.firstName} a été modifiée 💰`,
      );
      this.validAdherents = this.validAdherents.map((a) =>
        a.id === adherent.id ? { ...a, type } : a,
      );
    },

    async removeContribution(adherent: AdherentWithContribution) {
      const res = await ContributionRepository.removeContribution(
        adherent.id,
        adherent.edition,
      );

      if (isHttpError(res)) return;
      sendSuccessNotification(
        `La cotisation de ${adherent.firstName} a été supprimée 💰`,
      );
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
