import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { AvailabilityRegistery } from "~/domain/volunteer-availability/volunteer-availability.registery";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { castPeriods, Period } from "~/utils/models/period";
import { HttpStringified } from "~/utils/types/http";

const repo = RepoFactory.VolunteerAvailabilityRepository;

export const state = () => ({
  availabilityRegistery: AvailabilityRegistery.init(),
  currentCharisma: 0,
});

export const getters = getterTree(state, {
  mAvailabilities(state) {
    return state.availabilityRegistery.availabilities;
  },
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEER_AVAILABILITIES(state, availabilities: Availability[]) {
    state.availabilityRegistery =
      AvailabilityRegistery.fromAvailabilities(availabilities);
  },

  ADD_VOLUNTEER_AVAILABILITY(state, period: Period) {
    state.availabilityRegistery.addPeriod(period);
  },

  SET_CURRENT_CHARISMA(state, charisma: number) {
    state.currentCharisma = charisma;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteerAvailabilities(
      { commit, dispatch, rootState },
      userId: number
    ) {
      if (!rootState.user.me) dispatch("user/fetchUser", null, { root: true });
      commit("SET_CURRENT_CHARISMA", rootState.user.me.charisma);

      const res = await safeCall(
        this,
        repo.getVolunteerAvailabilities(this, userId)
      );
      if (!res) return;
      commit("SET_VOLUNTEER_AVAILABILITIES", castToAvailabilities(res.data));
    },

    async updateVolunteerAvailabilities(
      { commit, dispatch, state },
      userId: number
    ) {
      const res = await safeCall(
        this,
        repo.updateVolunteerAvailabilities(
          this,
          userId,
          state.availabilityRegistery.availabilities
        ),
        {
          successMessage: "Disponibilitiés sauvegardées 🥳",
          errorMessage: "Disponibilitiés non sauvegardées 😢",
        }
      );
      if (!res) return;
      commit("SET_VOLUNTEER_AVAILABILITIES", castToAvailabilities(res.data));

      const payload = {
        userID: userId,
        userData: {
          charisma: state.currentCharisma,
        },
      };
      dispatch("user/updateUser", payload, { root: true });
    },

    async addVolunteerAvailability({ commit }, availability: Availability) {
      commit("ADD_VOLUNTEER_AVAILABILITY", availability);
    },

    incrementCharisma({ commit, state }, increment: number) {
      commit("SET_CURRENT_CHARISMA", state.currentCharisma + increment);
    },

    decrementCharisma({ commit, state }, decrement: number) {
      commit("SET_CURRENT_CHARISMA", state.currentCharisma - decrement);
    },
  }
);

function castToAvailabilities(periods: HttpStringified<Period[]>) {
  return castPeriods(periods).map(Availability.fromPeriod);
}
