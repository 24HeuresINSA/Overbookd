import {
  Assignment,
  AssignmentIdentifier,
  TeamMember,
  VolunteerWithAssignmentDuration,
} from "@overbookd/assignment";
import {
  AssignmentSummaryWithTask,
  DisplayableAssignment,
  HttpStringified,
} from "@overbookd/http";
import { User } from "@overbookd/user";
import { actionTree, mutationTree } from "typed-vuex";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { VolunteerToTaskRepository } from "~/repositories/assignment/volunteer-to-task.repository";
import { UserRepository } from "~/repositories/user.repository";
import { safeCall } from "~/utils/api/calls";
import { castAssignmentWithDate } from "~/utils/assignment/assignment";
import { castPeriodWithDate } from "~/utils/http/period";

type State = {
  volunteers: VolunteerWithAssignmentDuration[];
  selectedVolunteer: VolunteerWithAssignmentDuration | null;
  selectedVolunteerFriends: User[];
  assignments: AssignmentSummaryWithTask[];
  alreadyAssignedAssignments: DisplayableAssignment[];
  hoverAssignment: AssignmentSummaryWithTask | null;
  assignmentDetails: Assignment<{ withDetails: true }> | null;
};

export const state = (): State => ({
  volunteers: [],
  selectedVolunteer: null,
  selectedVolunteerFriends: [],
  assignments: [],
  alreadyAssignedAssignments: [],
  hoverAssignment: null,
  assignmentDetails: null,
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: VolunteerWithAssignmentDuration[]) {
    state.volunteers = volunteers;
  },
  SELECT_VOLUNTEER(state, volunteer: VolunteerWithAssignmentDuration) {
    state.selectedVolunteer = volunteer;
  },
  SET_SELECTED_VOLUNTEER_FRIENDS(state, friends: User[]) {
    state.selectedVolunteerFriends = friends;
  },
  SET_ASSIGNMENTS(state, assignments: AssignmentSummaryWithTask[]) {
    state.assignments = assignments;
  },
  SET_ALREADY_ASSIGNED_ASSIGNMENTS(
    state,
    assignments: DisplayableAssignment[],
  ) {
    state.alreadyAssignedAssignments = assignments;
  },
  SET_HOVER_ASSIGNMENT(state, assignment: AssignmentSummaryWithTask | null) {
    state.hoverAssignment = assignment;
  },
  SET_ASSIGNMENT_DETAILS(state, assignment: Assignment<{ withDetails: true }>) {
    state.assignmentDetails = assignment;
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

      const res = await safeCall(
        this,
        UserRepository.getUserFriends(this, volunteer.id),
      );
      if (!res) return;
      commit("SET_SELECTED_VOLUNTEER_FRIENDS", res.data);

      dispatch("fetchPotentialAssignmentsFor", volunteer.id);
    },

    async fetchAllAssignmentsFor({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        AssignmentsRepository.findAllFor(this, volunteerId),
      );
      if (!res) return;

      const assignments = res.data.map(castDisplayableAssignmentWithDate);
      commit("SET_ALREADY_ASSIGNED_ASSIGNMENTS", assignments);
    },

    async fetchPotentialAssignmentsFor({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        VolunteerToTaskRepository.fetchPotentialAssignmentsFor(
          this,
          volunteerId,
        ),
      );
      if (!res) return;

      const assignments = res.data.map(castAssignmentSummaryWithTaskWithDate);
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
      dispatch("fetchPotentialAssignmentsFor", volunteer.id);
    },

    setHoverAssignment(
      { commit },
      assignment: AssignmentSummaryWithTask | null,
    ) {
      commit("SET_HOVER_ASSIGNMENT", assignment);
    },

    async fetchAssignmentDetails(
      { commit },
      assignmentIdentifier: AssignmentIdentifier,
    ) {
      const res = await safeCall(
        this,
        AssignmentsRepository.findOne(this, assignmentIdentifier, true),
      );
      if (!res) return;
      commit("SET_ASSIGNMENT_DETAILS", castAssignmentWithDate(res.data));
    },
  },
);

function castAssignmentSummaryWithTaskWithDate(
  assignment: HttpStringified<AssignmentSummaryWithTask>,
): AssignmentSummaryWithTask {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  };
}

function castDisplayableAssignmentWithDate(
  assignment: HttpStringified<DisplayableAssignment>,
): DisplayableAssignment {
  return {
    ...assignment,
    ...castPeriodWithDate(assignment),
  };
}
