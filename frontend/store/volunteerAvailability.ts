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
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteerAvailabilities({ commit }, userId: number) {
      const res = await safeCall(
        this,
        repo.getVolunteerAvailabilities(this, userId)
      );
      if (!res) return;
      commit("SET_VOLUNTEER_AVAILABILITIES", castToAvailabilities(res.data));
    },

    async updateVolunteerAvailabilities({ commit, state }, userId: number) {
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
    },

    async addVolunteerAvailability({ commit }, availability: Availability) {
      commit("ADD_VOLUNTEER_AVAILABILITY", availability);
    },
  }
);

function castToAvailabilities(periods: HttpStringified<Period[]>) {
  return castPeriods(periods).map(Availability.fromPeriod);
}
