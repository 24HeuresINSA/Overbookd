import {
  PreviewFestivalTask,
  FestivalTask,
  DRAFT,
} from "@overbookd/festival-event";
import { actionTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { FestivalTaskCreationForm } from "@overbookd/http";
import { FestivalTaskRepository } from "~/repositories/festival-task.repository";
import { castTaskWithDate } from "~/utils/festival-event/festival-task/festival-task.utils";

const repo = FestivalTaskRepository;

type State = {
  tasks: {
    forAll: PreviewFestivalTask[];
  };
  selectedTask: FestivalTask;
};

const fakeTask: FestivalTask = {
  id: 0,
  status: DRAFT,
  festivalActivity: {
    id: 0,
    name: "Fake FA",
    status: DRAFT,
    timeWindows: [],
    inquiry: {
      all: [],
      timeWindows: [],
    },
  },
  general: {
    name: "Fake FA",
    administrator: {
      id: 0,
      firstname: "Fake",
      lastname: "Adherent",
    },
    team: null,
  },
  instructions: {
    contacts: [],
    appointment: null,
    global: null,
    inCharge: {
      instruction: null,
      volunteers: [],
    },
  },
  feedbacks: [],
  gearInquiries: [],
  history: [],
  mobilizations: [],
};

export const state = (): State => ({
  tasks: {
    forAll: [],
  },
  selectedTask: fakeTask,
});

export const mutations = mutationTree(state, {
  SET_ALL_TASKS(state, tasks: PreviewFestivalTask[]) {
    state.tasks.forAll = tasks;
  },
  SET_SELECTED_TASK(state, task: FestivalTask) {
    state.selectedTask = task;
  },
});

export const actions = actionTree(
  { state, mutations },
  {
    /* FETCH */
    async fetchAllTasks({ commit }) {
      const res = await safeCall(this, repo.getAll(this));
      if (!res) return;
      commit("SET_ALL_TASKS", res.data);
    },

    async fetchTask({ commit }, id: number) {
      const res = await safeCall(this, repo.getOne(this, id));

      if (!res?.data) return;
      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
    },

    /* CREATE */
    async create({ commit, dispatch }, form: FestivalTaskCreationForm) {
      const res = await safeCall(this, repo.create(this, form));
      if (!res) return;

      const task = castTaskWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
      await dispatch("fetchAllTasks");
    },

    /* REMOVE */
    async remove({ commit, dispatch }, id: FestivalTask["id"]) {
      const res = await safeCall(this, repo.remove(this, id), {
        successMessage: `FT #${id} supprimée 🗑️`,
      });
      if (!res) return;

      commit("SET_SELECTED_TASK", fakeTask);
      await dispatch("fetchAllTasks");
    },
  },
);
