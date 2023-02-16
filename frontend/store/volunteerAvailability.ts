import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  castAllVolunteerAvailabilitysWithDate,
  castVolunteerAvailabilitiesWithDate,
  VolunteerAvailability,
  VolunteerWithAvailabilities,
} from "~/utils/models/volunteerAvailability";

const repo = RepoFactory.VolunteerAvailabilityRepository;

export const state = () => ({
  allAvailabilities: [] as VolunteerWithAvailabilities[],
  mAvailabilities: [] as VolunteerAvailability[],
});

export const mutations = mutationTree(state, {
  SET_ALL_VOLUNTEER_AVAILABILITIES(
    state,
    volunteerAvailabilities: VolunteerWithAvailabilities[]
  ) {
    state.allAvailabilities = volunteerAvailabilities;
  },

  SET_VOLUNTEER_AVAILABILITIES(
    state,
    volunteerAvailabilities: VolunteerAvailability[]
  ) {
    state.mAvailabilities = volunteerAvailabilities;
  },

  ADD_VOLUNTEER_AVAILABILITY(
    state,
    volunteerAvailability: VolunteerAvailability
  ) {
    state.mAvailabilities = [...state.mAvailabilities, volunteerAvailability];
  },

  DELETE_VOLUNTEER_AVAILABILITY(
    state,
    volunteerAvailability: VolunteerAvailability
  ) {
    state.mAvailabilities = state.mAvailabilities.filter(
      (va) =>
        va.start !== volunteerAvailability.start &&
        va.end !== volunteerAvailability.end
    );
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchAllVolunteerAvailabilities({ commit }) {
      const res = await safeCall(
        this,
        repo.getAllVolunteerAvailabilities(this)
      );
      if (!res) return;
      commit(
        "SET_ALL_VOLUNTEER_AVAILABILITIES",
        castAllVolunteerAvailabilitysWithDate(res.data)
      );
    },

    async fetchVolunteerAvailabilities({ commit }, userId: number) {
      const res = await safeCall(
        this,
        repo.getVolunteerAvailabilities(this, userId)
      );
      if (!res) return;
      commit(
        "SET_VOLUNTEER_AVAILABILITIES",
        castVolunteerAvailabilitiesWithDate(res.data)
      );
    },

    async updateVolunteerAvailabilities({ commit, state }, userId: number) {
      const res = await safeCall(
        this,
        repo.updateVolunteerAvailability(this, userId, state.mAvailabilities),
        {
          successMessage: "Disponibilitiés sauvegardées 🥳",
          errorMessage: "Disponibilitiés non sauvegardées 😢",
        }
      );
      if (!res) return;
      commit(
        "SET_VOLUNTEER_AVAILABILITIES",
        castVolunteerAvailabilitiesWithDate(res.data)
      );
    },

    async addVolunteerAvailability(
      { commit },
      volunteerAvailability: VolunteerAvailability
    ) {
      commit("ADD_VOLUNTEER_AVAILABILITY", volunteerAvailability);
    },

    async deleteVolunteerAvailability(
      { commit },
      volunteerAvailability: VolunteerAvailability
    ) {
      commit("DELETE_VOLUNTEER_AVAILABILITY", volunteerAvailability);
    },
  }
);
