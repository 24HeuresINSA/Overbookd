import {
  CreateFestivalActivityForm,
  FestivalActivity,
  PrepareFeedbackPublish,
  PrepareGeneralUpdate,
  PrepareSignageCreation,
  PrepareSignageUpdate,
  PrepareSupplyUpdate,
  PreviewFestivalActivity,
  Signage,
  TimeWindow,
  defaultDraft,
} from "@overbookd/festival-activity";
import { PrepareInChargeForm, PrepareSignaForm } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { actionTree, mutationTree } from "typed-vuex";
import { FestivalActivityRepository } from "~/repositories/festival-activity.repository";
import { safeCall } from "~/utils/api/calls";
import { castActivityWithDate } from "~/utils/festival-event/festival-activity.utils";

const repo = FestivalActivityRepository;

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

    /* UPDATE GENERAL */
    async updateGeneral({ state, commit }, general: PrepareGeneralUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateGeneral(this, id, general));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async addGeneralTimeWindow({ state, commit }, timeWindow: IProvidePeriod) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.addGeneralTimeWindow(this, id, timeWindow),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeGeneralTimeWindow(
      { state, commit },
      timeWindowId: TimeWindow["id"],
    ) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.removeGeneralTimeWindow(this, id, timeWindowId),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE IN CHARGE */
    async updateInCharge({ state, commit }, inCharge: PrepareInChargeForm) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateInCharge(this, id, inCharge));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE SIGNA */
    async updateSigna({ state, commit }, signa: PrepareSignaForm) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSigna(this, id, signa));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async addSignage({ state, commit }, signage: PrepareSignageCreation) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.addSignage(this, id, signage));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async updateSignage({ state, commit }, signage: PrepareSignageUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSignage(this, id, signage));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async removeSignage({ state, commit }, signageId: Signage["id"]) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.removeSignage(this, id, signageId));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    /* UPDATE SECURITY */
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

    /* UPDATE SUPPLY */
    async updateSupply({ state, commit }, supply: PrepareSupplyUpdate) {
      const id = state.selectedActivity.id;
      const res = await safeCall(this, repo.updateSupply(this, id, supply));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async publishFeedback({ state, commit }, feedback: PrepareFeedbackPublish) {
      const id = state.selectedActivity.id;
      const res = await safeCall(
        this,
        repo.publishFeedback(this, id, feedback),
      );
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
    },
  },
);
