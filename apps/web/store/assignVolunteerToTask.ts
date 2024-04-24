import {
  AssignmentIdentifier,
  TeamMember,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import { AssignmentSummaryWithTask, HttpStringified } from "@overbookd/http";
import { actionTree, mutationTree } from "typed-vuex";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { VolunteerToTaskRepository } from "~/repositories/assignment/volunteer-to-task.repository";
import { safeCall } from "~/utils/api/calls";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  volunteers: VolunteerWithAssignmentDuration[];
  selectedVolunteer: VolunteerWithAssignmentDuration | null;
  assignments: AssignmentSummaryWithTask[];
  hoverAssignment: AssignmentSummaryWithTask | null;
};

export const state = (): State => ({
  volunteers: [],
  selectedVolunteer: null,
  assignments: [],
  hoverAssignment: null,
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: VolunteerWithAssignmentDuration[]) {
    state.volunteers = volunteers;
  },
  SELECT_VOLUNTEER(state, volunteer: VolunteerWithAssignmentDuration) {
    state.selectedVolunteer = volunteer;
  },
  SET_ASSIGNMENTS(state, assignments: AssignmentSummaryWithTask[]) {
    state.assignments = assignments;
  },
  SET_HOVER_ASSIGNMENT(state, assignment: AssignmentSummaryWithTask | null) {
    state.hoverAssignment = assignment;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteers({ commit }) {
      const res = await safeCall(
        this,
        VolunteerToTaskRepository.getVolunteers(this),
      );
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },

    async selectVolunteer(
      { commit, dispatch },
      volunteer: VolunteerWithAssignmentDuration,
    ) {
      commit("SELECT_VOLUNTEER", volunteer);
      dispatch("fetchAssignmentsFor", volunteer.id);
    },

    async fetchAssignmentsFor({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        VolunteerToTaskRepository.getAssignmentsFor(this, volunteerId),
      );
      if (!res) return;

      const assignments = res.data.map(toAssignmentSummaryWithTask);
      commit("SET_ASSIGNMENTS", assignments);
    },

    async assign(
      { dispatch },
      {
        assignment,
        volunteer,
      }: {
        assignment: AssignmentIdentifier;
        volunteer: TeamMember;
      },
    ) {
      const repository = new AssignmentsRepository(this);
      const res = await repository.assign({
        assignment,
        volunteers: [volunteer],
      });
      if (!res) return;

      dispatch("user/getVolunteerAssignments", volunteer.id, { root: true });
      dispatch("fetchAssignmentsFor", volunteer.id);
    },

    setHoverAssignment(
      { commit },
      assignment: AssignmentSummaryWithTask | null,
    ) {
      commit("SET_HOVER_ASSIGNMENT", assignment);
    },
  },
);

function toAssignmentSummaryWithTask(
  assignment: HttpStringified<AssignmentSummaryWithTask>,
): AssignmentSummaryWithTask {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  };
}
