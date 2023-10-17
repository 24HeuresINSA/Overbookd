import {
  IDefineMealDate,
  IExposeSharedMeal,
  InMemoryAdherents,
  InMemorySharedMeals,
  MealSharing,
} from "@overbookd/personal-account";
import { actionTree, mutationTree } from "typed-vuex";

const sharedMeals = new InMemorySharedMeals();

interface MealSharingState {
  sharedMeal?: IExposeSharedMeal;
}

export const state: MealSharingState = {
  sharedMeal: undefined,
};

export const mutations = mutationTree(state, {
  SET_SHARED_MEAL(state, sharedMeal: IExposeSharedMeal) {
    state.sharedMeal = sharedMeal;
  },
  RESET_SHARED_MEAL(state) {
    state.sharedMeal = undefined;
  },
});

export const actions = actionTree(
  { state },
  {
    async offerSharedMeal(
      { commit, rootState },
      {
        menu,
        date,
        chefId,
      }: { menu: string; date: IDefineMealDate; chefId: number },
    ) {
      const { id, firstname, lastname, nickname } = rootState.user.me;
      const adherent = { id, name: nickname ?? `${firstname} ${lastname}` };

      const adherents = new InMemoryAdherents([adherent]);
      const mealSharing = new MealSharing(sharedMeals, adherents);
      const sharedMeal = await mealSharing.offer(menu, date, chefId);
      commit("SET_SHARED_MEAL", sharedMeal);
    },

    async find({ state, dispatch, rootState }, mealId: number) {
      if (state.sharedMeal?.id === mealId) return;

      dispatch("offerSharedMeal", {
        menu: "Couscous",
        date: { day: new Date(), moment: "SOIR" },
        chefId: rootState.user.me.id,
      });
    },
  },
);
