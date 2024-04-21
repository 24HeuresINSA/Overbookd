import {
  AssignableVolunteer,
  Assignment,
  AssignmentVolunteer,
  Funnel,
  MissingAssignmentTask,
  ReadyToStart,
  TaskWithAssignmentsSummary,
  isReadyToStart,
  isWaitingForVolunteer,
} from "@overbookd/assignment";
import { actionTree, mutationTree } from "typed-vuex";
import { TaskToVolunteerRepository } from "~/repositories/assignment/task-to-volunteer.repository";
import { safeCall } from "~/utils/api/calls";
import { ExtendedAssignementIdentifier } from "../utils/assignment/assignment-identifier";
import { HttpStringified } from "@overbookd/http";
import { assignments, candidateFactory } from "~/utils/assignment/funnel";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  tasks: MissingAssignmentTask[];
  selectedTask: TaskWithAssignmentsSummary | null;
  selectedAssignment: Assignment | null;
  assignableVolunteers: AssignableVolunteer[];
  funnel: Funnel | null;
};

export const state = (): State => ({
  tasks: [],
  selectedTask: null,
  selectedAssignment: null,
  assignableVolunteers: [],
  funnel: null,
});

export const mutations = mutationTree(state, {
  SET_TASKS(state, tasks: MissingAssignmentTask[]) {
    state.tasks = tasks;
  },
  SET_SELECTED_TASK(state, task: TaskWithAssignmentsSummary | null) {
    state.selectedTask = task;
  },
  SET_SELECTED_ASSIGNMENT(state, assignment: Assignment) {
    state.selectedAssignment = assignment;
  },
  RESET_SELECTED_ASSIGNMENT(state) {
    state.selectedAssignment = null;
  },
  SET_ASSIGNABLE_VOLUNTEERS(state, volunteers: AssignableVolunteer[]) {
    state.assignableVolunteers = volunteers;
  },
  SET_FUNNEL(state, funnel: Funnel) {
    state.funnel = funnel;
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

      const funnel = ReadyToStart.init(
        candidateFactory(this),
        assignments(this),
      );
      commit("SET_FUNNEL", funnel);
    },

    async selectTask({ commit }, taskId: number) {
      const res = await safeCall(
        this,
        TaskToVolunteerRepository.selectTask(this, taskId),
      );
      if (!res) return;

      const task = castTaskWithAssignmentsSummaryWithDate(res.data);
      commit("SET_SELECTED_TASK", task);
      commit("RESET_SELECTED_ASSIGNMENT");
      commit("SET_ASSIGNABLE_VOLUNTEERS", []);
    },

    async selectAssignment(
      { commit, state },
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

      if (state.funnel === null || !isReadyToStart(state.funnel)) return;
      const assignment = castAssignmentWithDate(assignmentRes.data);
      const funnel = state.funnel.select(assignment);
      commit("SET_SELECTED_ASSIGNMENT", assignment);
      commit("SET_FUNNEL", funnel);
    },

    async selectVolunteer({ commit, state }, volunteer: AssignmentVolunteer) {
      if (state.funnel === null || !isWaitingForVolunteer(state.funnel)) return;
      const funnel = await state.funnel.select(volunteer);
      commit("SET_FUNNEL", funnel);
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

function castAssignmentWithDate(
  assignment: HttpStringified<Assignment>,
): Assignment {
  return { ...assignment, ...castPeriodWithDate(assignment) };
}
