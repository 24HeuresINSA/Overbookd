import { actionTree, mutationTree } from "typed-vuex";
import { Adherent, PayContributionForm } from "@overbookd/contribution";
import { safeCall } from "~/utils/api/calls";
import { ContributionRepository } from "~/repositories/contribution.repository";

type State = {
  adherentsOutToDate: Adherent[];
};

export const state = (): State => ({
  adherentsOutToDate: [],
});

export const mutations = mutationTree(state, {
  SET_ADHERENTS_OUT_TO_DATE(state, adherents: Adherent[]) {
    state.adherentsOutToDate = adherents;
  },
  REMOVE_OUT_TO_DATE_ADHERENT(state, adherentId: number) {
    state.adherentsOutToDate = state.adherentsOutToDate.filter(
      (adherent) => adherent.id !== adherentId,
    );
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    async fetchAdherentsOutToDate({ commit }) {
      const res = await safeCall(
        this,
        ContributionRepository.fetchAdherentsOutToDate(this),
      );
      if (!res) return;
      commit("SET_ADHERENTS_OUT_TO_DATE", res.data);
    },

    async payContribution(
      { commit },
      { adherent, amount }: { adherent: Adherent; amount: number },
    ) {
      const form: PayContributionForm = { adherentId: adherent.id, amount };
      const res = await safeCall(
        this,
        ContributionRepository.payContribution(this, form),
        {
          successMessage: "La cotisation a été payée avec succès 💰",
        },
      );
      if (!res) return;
      commit("REMOVE_OUT_TO_DATE_ADHERENT", adherent.id);
    },
  },
);
