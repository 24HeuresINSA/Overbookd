import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { PeriodOrchestrator } from "~/domain/volunteer-availability/period-orchestrator";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { AvailabilityRegistery } from "~/domain/volunteer-availability/volunteer-availability.registery";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { castPeriods, Period } from "~/utils/models/period";
import { HttpStringified } from "~/utils/types/http";

const repo = RepoFactory.VolunteerAvailabilityRepository;

export const state = () => ({
  availabilityRegistery: AvailabilityRegistery.init(),
  periodOrchestrator: PeriodOrchestrator.init(),
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

  SET_PERIOD_ORCHESTRATOR(state, periods: Period[]) {
    state.periodOrchestrator = PeriodOrchestrator.init(periods);
  },

  ADD_VOLUNTEER_AVAILABILITY(state, period: Period) {
    state.availabilityRegistery.addPeriod(period);
  },

  ADD_PERIOD_IN_PERIOD_ORCHESTRATOR(state, period: Period) {
    state.periodOrchestrator.addPeriod(period);
  },

  REMOVE_PERIOD_IN_PERIOD_ORCHESTRATOR(state, period: Period) {
    state.periodOrchestrator.removePeriod(period);
  },

  SET_CURRENT_CHARISMA(state, charisma: number) {
    state.currentCharisma = charisma;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteerAvailabilities({ commit, rootState }, userId: number) {
      commit("SET_CURRENT_CHARISMA", rootState.user.me.charisma);

      const res = await safeCall(
        this,
        repo.getVolunteerAvailabilities(this, userId)
      );
      if (!res) return;
      commit("SET_VOLUNTEER_AVAILABILITIES", castToAvailabilities(res.data));
      commit("SET_PERIOD_ORCHESTRATOR", castPeriods(res.data));
    },

    async updateVolunteerAvailabilities(
      { commit, dispatch, state, rootState },
      userId: number
    ) {
      const res = await safeCall(
        this,
        repo.updateVolunteerAvailabilities(
          this,
          userId,
          state.periodOrchestrator.availabilityPeriods
        ),
        {
          successMessage: "Disponibilitiés sauvegardées 🥳",
          errorMessage: "Disponibilitiés non sauvegardées 😢",
        }
      );
      if (!res) return;
      commit("SET_VOLUNTEER_AVAILABILITIES", castToAvailabilities(res.data));

      dispatch("user/fetchUser", null, { root: true });
      commit("SET_CURRENT_CHARISMA", rootState.user.me.charisma);

      return this.$router.push({ path: "/" });
    },

    async addVolunteerAvailability({ commit }, availability: Availability) {
      commit("ADD_VOLUNTEER_AVAILABILITY", availability);
    },

    addAvailabilityPeriod({ commit }, period: Period) {
      commit("ADD_PERIOD_IN_PERIOD_ORCHESTRATOR", period);
    },

    addAvailabilityPeriods({ commit }, periods: Period[]) {
      periods.map((period) => {
        commit("ADD_PERIOD_IN_PERIOD_ORCHESTRATOR", period);
      });
    },

    removeAvailabilityPeriod({ commit }, period: Period) {
      commit("REMOVE_PERIOD_IN_PERIOD_ORCHESTRATOR", period);
    },

    removeAvailabilityPeriods({ commit }, periods: Period[]) {
      periods.map((period) => {
        commit("REMOVE_PERIOD_IN_PERIOD_ORCHESTRATOR", period);
      });
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
