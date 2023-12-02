import {
  CreateFestivalActivityForm,
  FestivalActivity,
  PrepareGeneralUpdate,
  PrepareInChargeForm,
  PrepareSignaForm,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
  defaultDraft,
} from "@overbookd/festival-activity";
import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { castActivityWithDate } from "~/utils/festival-event/festival-activity.utils";

const repo = RepoFactory.FestivalActivityRepository;

type State = {
  allActivities: PreviewFestivalActivity[];
  selectedActivity: FestivalActivity;
};

export const state = (): State => ({
  allActivities: [],
  selectedActivity: defaultDraft(0, "Fake activity"),
});

export const mutations = mutationTree(state, {
  SET_ALL_ACTIVITIES(state, activities: PreviewFestivalActivity[]) {
    state.allActivities = activities;
  },
  SET_SELECTED_ACTIVITY(state, activity: FestivalActivity) {
    state.selectedActivity = activity;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    /* FETCH */
    async fetchAllActivities({ commit }) {
      const res = await safeCall(this, repo.getAll(this));
      if (!res) return;
      commit("SET_ALL_ACTIVITIES", res.data);
    },

    async fetchActivity({ commit }, id: number) {
      const res = await safeCall(this, repo.getOne(this, id));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* CREATE */
    async create({ commit, dispatch }, form: CreateFestivalActivityForm) {
      const res = await safeCall(this, repo.create(this, form));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
      await dispatch("fetchAllActivities");
    },

    /* UPDATE SECTIONS */
    async updateGeneral({ state, commit }, general: PrepareGeneralUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateGeneral(this, id, general));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateInCharge({ state, commit }, inCharge: PrepareInChargeForm) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateInCharge(this, id, inCharge));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateSigna({ state, commit }, signa: PrepareSignaForm) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSigna(this, id, signa));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateSecurity(
      { state, commit },
      security: FestivalActivity["security"],
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSecurity(this, id, security));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateSupply({ state, commit }, supply: PrepareSupplyUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSupply(this, id, supply));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },
  },
);
