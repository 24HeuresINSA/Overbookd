import {
  AssignableVolunteer,
  AssignmentVolunteer,
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
  selectedVolunteer: AssignmentVolunteer | null;
};

export const state = (): State => ({
  tasks: [],
  selectedTask: null,
  selectedAssignment: null,
  assignableVolunteers: [],
  selectedVolunteer: null,
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
  SELECT_VOLUNTEER(state, volunteer: AssignmentVolunteer) {
    state.selectedVolunteer = volunteer;
  },
  RESET_SELECTED_VOLUNTEER(state) {
    state.selectedVolunteer = null;
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

    async selectVolunteer({ commit }, volunteer: AssignmentVolunteer) {
      commit("SELECT_VOLUNTEER", volunteer);
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
