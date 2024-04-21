import {
  AssignableVolunteer,
  Assignment,
  AssignmentVolunteer,
  MissingAssignmentTask,
  TaskWithAssignmentsSummary,
} from "@overbookd/assignment";
import { actionTree, mutationTree } from "typed-vuex";
import { TaskToVolunteerRepository } from "~/repositories/assignment/task-to-volunteer.repository";
import { safeCall } from "~/utils/api/calls";
import { ExtendedAssignementIdentifier } from "../utils/assignment/assignment-identifier";
import { HttpStringified } from "@overbookd/http";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  tasks: MissingAssignmentTask[];
  selectedTask: TaskWithAssignmentsSummary | null;
  selectedAssignment: Assignment | null;
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
  SELECT_TASK(state, task: TaskWithAssignmentsSummary) {
    state.selectedTask = task;
  },
  SELECT_ASSIGNMENT(state, assignment: Assignment) {
    state.selectedAssignment = assignment;
  },
  RESET_SELECTED_ASSIGNMENT(state) {
    state.selectedAssignment = null;
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
      commit("SELECT_TASK", task);
      commit("RESET_SELECTED_ASSIGNMENT");
      commit("RESET_SELECTED_VOLUNTEER");
      commit("SET_ASSIGNABLE_VOLUNTEERS", []);
    },

    async selectAssignment(
      { commit },
      assignmentIdentifier: ExtendedAssignementIdentifier,
    ) {
      const [assignableVolunteersRes, assignmentRes] = await Promise.all([
        safeCall(
          this,
          TaskToVolunteerRepository.getAssignableVolunteersForAssignement(
            this,
            assignmentIdentifier,
          ),
        ),
        safeCall(
          this,
          AssignmentsRepository.findOne(this, assignmentIdentifier),
        ),
      ]);
      if (!assignableVolunteersRes || !assignmentRes) return;
      commit("SET_ASSIGNABLE_VOLUNTEERS", assignableVolunteersRes.data);
      commit("SELECT_ASSIGNMENT", castAssignmentWithDate(assignmentRes.data));
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
      ...castPeriodWithDate(assignment),
    })),
  };
}

function castAssignmentWithDate(
  assignment: HttpStringified<Assignment>,
): Assignment {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  };
}
