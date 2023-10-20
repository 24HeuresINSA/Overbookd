import {
  CreateFestivalActivityForm,
  DraftFestivalActivity,
  FestivalActivityRepresentation,
  PreviewFestivalActivity,
} from "@overbookd/festival-activity";
import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { castActivityWithDate } from "~/utils/festival-event/festival-activity.utils";

const repo = RepoFactory.FestivalActivityRepository;

type State = {
  allActivities: PreviewFestivalActivity[];
  selectedActivity: FestivalActivityRepresentation | null;
};

export const state = (): State => ({
  allActivities: [],
  selectedActivity: null,
});

export const mutations = mutationTree(state, {
  SET_ALL_ACTIVITIES(state, activities: PreviewFestivalActivity[]) {
    state.allActivities = activities;
  },
  SET_SELECTED_ACTIVITY(
    state,
    activity: FestivalActivityRepresentation | null,
  ) {
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

      const castedActivity = castActivityWithDate(res.data);
      const activity = DraftFestivalActivity.build(castedActivity);
      commit("SET_SELECTED_ACTIVITY", activity);
    },

    async create({ commit, dispatch }, form: CreateFestivalActivityForm) {
      const res = await safeCall(this, repo.create(this, form));
      if (!res) return;

      const castedActivity = castActivityWithDate(res.data);
      const activity = DraftFestivalActivity.build(castedActivity);
      commit("SET_SELECTED_ACTIVITY", activity);
      await dispatch("fetchAllActivities");
    },
  },
);
