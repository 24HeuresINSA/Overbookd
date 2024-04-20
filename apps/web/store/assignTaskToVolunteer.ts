import {
  AssignableVolunteers,
  AssignmentIdentifier,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { actionTree, mutationTree } from "typed-vuex";
import { TaskToVolunteerRepository } from "~/repositories/assignment/task-to-volunteer.repository";
import { safeCall } from "~/utils/api/calls";

type State = {
  tasks: MissingAssignmentTask[];
  selectedTask: TaskWithAssignmentsSummary | null;
  assignableVolunteers: AssignableVolunteers[];
};

export const state = (): State => ({
  tasks: [],
  selectedTask: null,
  assignableVolunteers: [],
});

type ExtendedAssignementIdentifier = AssignmentIdentifier & { taskId: number };

export const mutations = mutationTree(state, {
  SET_TASKS(state, tasks: MissingAssignmentTask[]) {
    state.tasks = tasks;
  },
  SET_SELECTED_TASK(state, task: TaskWithAssignmentsSummary) {
    state.selectedTask = task;
  },
  SET_ASSIGNABLE_VOLUNTEERS(state, volunteers: AssignableVolunteers[]) {
    state.assignableVolunteers = volunteers;
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
    async selectTask({ commit }, ftId: number) {
      const res = await safeCall(
        this,
        TaskToVolunteerRepository.selectTask(this, ftId),
      );
      if (!res) return;
      commit("SET_SELECTED_TASK", res.data);
    },
    async setAssignableVolunteers(
      { commit },
      assignmentIdentifier: ExtendedAssignementIdentifier,
    ) {
      const res = await safeCall(
        this,
        TaskToVolunteerRepository.getAssignableVolunteersForAssignement(
          this,
          assignmentIdentifier.taskId,
          assignmentIdentifier.mobilizationId,
          assignmentIdentifier.assignmentId,
        ),
      );
      if (!res) return;
      commit("SET_ASSIGNABLE_VOLUNTEERS", res);
    },
  },
);
