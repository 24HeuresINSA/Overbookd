import { MissingAssignmentTask } from "@overbookd/assignment";
import { actionTree, mutationTree } from "typed-vuex";
import { TaskToVolunteerRepository } from "~/repositories/assignment/task-to-volunteer.repository";
import { safeCall } from "~/utils/api/calls";

type State = {
  tasks: MissingAssignmentTask[];
};

export const state = (): State => ({
  tasks: [],
});

export const mutations = mutationTree(state, {
  SET_TASKS(state, tasks: MissingAssignmentTask[]) {
    state.tasks = tasks;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchTasks({ commit }) {
      const res = await safeCall(
        this,
        TaskToVolunteerRepository.getTasks(this),
      );
      if (!res) return;
      commit("SET_TASKS", res.data);
    },
  },
);
