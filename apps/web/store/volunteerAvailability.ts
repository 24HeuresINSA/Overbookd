import { actionTree, mutationTree } from "typed-vuex";
import { Period } from "@overbookd/period";
import {
  Availabilities,
  InitOverDate,
} from "@overbookd/volunteer-availability";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { castPeriods } from "~/utils/models/period.model";

const repo = RepoFactory.VolunteerAvailabilityRepository;

type VolunteerAvailabilityState = {
  availabilities: Availabilities;
  currentCharisma: number;
};

export const state = (): VolunteerAvailabilityState => ({
  availabilities: Availabilities.init(),
  currentCharisma: 0,
});

type AvailabilitySelection = {
  charisma: number;
  date: InitOverDate;
};

type UpdateVolunteerAvailabilities = {
  volunteerId: number;
  availabilities: Period[];
};

export const mutations = mutationTree(state, {
  INIT_AVAILABILITIES(state, recorded: Period[]) {
    state.availabilities = Availabilities.init({ recorded });
  },

  SELECT_AVAILABILITY(state, { charisma, date }: AvailabilitySelection) {
    state.availabilities = state.availabilities.select(date);
    state.currentCharisma = state.currentCharisma + charisma;
  },

  UNSELECT_AVAILABILITY(state, { charisma, date }: AvailabilitySelection) {
    state.availabilities = state.availabilities.unselect(date);
    state.currentCharisma = state.currentCharisma - charisma;
  },

  ALLOW_FORCE_AVAILABILITY_UPDATE(state) {
    const all = state.availabilities.list;
    state.availabilities = Availabilities.init({ selected: all });
  },

  SET_CURRENT_CHARISMA(state, charisma: number) {
    state.currentCharisma = charisma;
  },
});

export const actions = actionTree(
  { state },
  {
    clearVolunteerAvailabilities({ commit }) {
      commit("INIT_AVAILABILITIES", []);
      commit("SET_CURRENT_CHARISMA", 0);
    },
    async fetchVolunteerAvailabilities({ commit, rootState }, userId: number) {
      commit("SET_CURRENT_CHARISMA", rootState.user.me.charisma);

      const res = await safeCall(
        this,
        repo.getVolunteerAvailabilities(this, userId),
      );
      if (!res) return;
      commit("INIT_AVAILABILITIES", castPeriods(res.data));
    },

    async updateVolunteerAvailabilities(
      { commit, dispatch, state },
      userId: number,
    ) {
      const res = await safeCall(
        this,
        repo.updateVolunteerAvailabilities(
          this,
          userId,
          state.availabilities.list,
        ),
        {
          successMessage: "Disponibilitiés sauvegardées 🥳",
          errorMessage: "Disponibilitiés non sauvegardées 😢",
        },
      );
      if (!res) return;
      commit("INIT_AVAILABILITIES", castPeriods(res.data));

      dispatch("user/fetchMyInformation", null, { root: true });
    },

    async overrideVolunteerAvailabilities(
      { commit },
      { volunteerId, availabilities }: UpdateVolunteerAvailabilities,
    ) {
      const res = await safeCall(
        this,
        repo.overrideVolunteerAvailabilities(this, volunteerId, availabilities),
        {
          successMessage: "Disponibilitiés sauvegardées 🥳",
          errorMessage: "Disponibilitiés non sauvegardées 😢",
        },
      );
      if (!res) return;
      commit("INIT_AVAILABILITIES", castPeriods(res.data));
    },

    selectAvailability({ commit }, selected: AvailabilitySelection) {
      commit("SELECT_AVAILABILITY", selected);
    },

    unSelectAvailability({ commit }, unSelected: AvailabilitySelection) {
      commit("UNSELECT_AVAILABILITY", unSelected);
    },

    removeRecordedAvailability({ commit }, unSelected: AvailabilitySelection) {
      commit("ALLOW_FORCE_AVAILABILITY_UPDATE");
      commit("UNSELECT_AVAILABILITY", unSelected);
    },
  },
);
