import {
  AssignableVolunteer,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { actionTree, mutationTree } from "typed-vuex";
import { TaskToVolunteerRepository } from "~/repositories/assignment/task-to-volunteer.repository";
import { safeCall } from "~/utils/api/calls";
import { ExtendedAssignementIdentifier } from "../utils/assignment/assignment-identifier";
import { HttpStringified } from "@overbookd/http";

type State = {
  tasks: MissingAssignmentTask[];
  selectedTask: TaskWithAssignmentsSummary | null;
  selectedAssignment: ExtendedAssignementIdentifier | null;
  assignableVolunteers: AssignableVolunteer[];
};

export const state = (): State => ({
  tasks: [],
  selectedTask: null,
  selectedAssignment: null,
  assignableVolunteers: [],
});

export const mutations = mutationTree(state, {
  SET_TASKS(state, tasks: MissingAssignmentTask[]) {
    state.tasks = tasks;
  },
  SET_SELECTED_TASK(state, task: TaskWithAssignmentsSummary | null) {
    state.selectedTask = task;
  },
  SET_SELECTED_ASSIGNMENT(
    state,
    assignmentIdentifier: ExtendedAssignementIdentifier | null,
  ) {
    state.selectedAssignment = assignmentIdentifier;
  },
  SET_ASSIGNABLE_VOLUNTEERS(state, volunteers: AssignableVolunteer[]) {
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

    async selectTask({ commit }, taskId: number) {
      const res = await safeCall(
        this,
        TaskToVolunteerRepository.selectTask(this, taskId),
      );
      if (!res) return;

      const task = castTaskWithAssignmentsSummaryWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
      commit("SET_SELECTED_ASSIGNMENT", null);
      commit("SET_ASSIGNABLE_VOLUNTEERS", []);
    },

    async selectAssignment(
      { commit },
      assignmentIdentifier: ExtendedAssignementIdentifier,
    ) {
      const res = await safeCall(
        this,
        TaskToVolunteerRepository.getAssignableVolunteersForAssignement(
          this,
          assignmentIdentifier,
        ),
      );
      if (!res) return;
      commit("SET_SELECTED_ASSIGNMENT", assignmentIdentifier);
      commit("SET_ASSIGNABLE_VOLUNTEERS", res.data);
    },
  },
);

function castTaskWithAssignmentsSummaryWithDate(
  task: HttpStringified<TaskWithAssignmentsSummary>,
): TaskWithAssignmentsSummary {
  return {
    ...task,
    assignments: task.assignments.map((assignment) => ({
      ...assignment,
      start: new Date(assignment.start),
      end: new Date(assignment.end),
    })),
  };
}
