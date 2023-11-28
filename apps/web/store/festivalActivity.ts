import {
  CreateFestivalActivityForm,
  FestivalActivity,
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

    async create({ commit, dispatch }, form: CreateFestivalActivityForm) {
      const res = await safeCall(this, repo.create(this, form));
      if (!res) return;

      const activity = castActivityWithDate(res.data);
      commit("SET_SELECTED_ACTIVITY", activity);
      await dispatch("fetchAllActivities");
    },
  },
);
