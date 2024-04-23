import {
  AssignableVolunteer,
  Assignment,
  AssignmentIdentifier,
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
  assignmentDetails: Assignment<{ withDetails: true }> | null;
};

export const state = (): State => ({
  tasks: [],
  selectedTask: null,
  selectedAssignment: null,
  assignableVolunteers: [],
  selectedVolunteer: null,
  assignmentDetails: null,
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
  SET_ASSIGNMENT_DETAILS(state, assignment: Assignment<{ withDetails: true }>) {
    state.assignmentDetails = assignment;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchTasks({ commit }, all: boolean = false) {
      const res = await safeCall(
        this,
        TaskToVolunteerRepository.getTasks(this, all),
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

    async fetchAssignmentDetails(
      { commit },
      assignmentIdentifier: ExtendedAssignementIdentifier,
    ) {
      const res = await safeCall(
        this,
        AssignmentsRepository.findOne(this, assignmentIdentifier, true),
      );
      if (!res) return;
      commit("SET_ASSIGNMENT_DETAILS", castAssignmentWithDate(res.data));
    },

    async unassign(
      { dispatch },
      {
        assignmentId,
        assigneeId,
      }: { assignmentId: AssignmentIdentifier; assigneeId: number },
    ) {
      const repository = new AssignmentsRepository(this);
      await repository.unassign(assignmentId, assigneeId);
      dispatch("fetchAssignmentDetails", assignmentId);
      dispatch("selectTask", assignmentId.taskId);
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
  assignment: HttpStringified<Assignment | Assignment<{ withDetails: true }>>,
): Assignment | Assignment<{ withDetails: true }> {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  };
}
