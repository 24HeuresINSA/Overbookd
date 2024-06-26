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
import { IProvidePeriod } from "@overbookd/period";
import { User } from "@overbookd/user";
import { actionTree, mutationTree } from "typed-vuex";
import { AssignmentsRepository } from "~/repositories/assignment/assignments.repository";
import { VolunteerToTaskRepository } from "~/repositories/assignment/volunteer-to-task.repository";
import { PlanningRepository } from "~/repositories/planning.repository";
import { UserRepository } from "~/repositories/user.repository";
import { safeCall } from "~/utils/api/calls";
import {
  UnassignForm,
  castAssignmentWithDate,
} from "~/utils/assignment/assignment";
import { castPeriodWithDate, castPeriodsWithDate } from "~/utils/http/period";

type State = {
  volunteers: VolunteerWithAssignmentDuration[];
  selectedVolunteer: VolunteerWithAssignmentDuration | null;
  selectedVolunteerFriends: User[];
  assignments: AssignmentSummaryWithTask[];
  alreadyAssignedAssignments: DisplayableAssignment[];
  breakPeriods: IProvidePeriod[];
  hoverAssignment: AssignmentSummaryWithTask | null;
  assignmentDetails: Assignment<{ withDetails: true }> | null;
};

export const state = (): State => ({
  volunteers: [],
  selectedVolunteer: null,
  selectedVolunteerFriends: [],
  assignments: [],
  alreadyAssignedAssignments: [],
  breakPeriods: [],
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
  SET_BREAK_PERIODS(state, breaks: IProvidePeriod[]) {
    state.breakPeriods = breaks;
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

    async fetchBreakPeriodsFor({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        PlanningRepository.getBreakPeriods(this, volunteerId),
      );
      if (!res) return;

      const breaks = castPeriodsWithDate(res.data);
      commit("SET_BREAK_PERIODS", breaks);
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
      { dispatch, commit },
      {
        assignment,
        volunteer,
      }: {
        assignment: AssignmentIdentifier;
        volunteer: TeamMember;
      },
    ) {
      commit("SET_HOVER_ASSIGNMENT", null);

      const repository = new AssignmentsRepository(this);
      const res = await repository.assign({
        assignment,
        volunteers: [volunteer],
      });
      if (!res) return;

      dispatch("fetchVolunteers");
      dispatch("fetchAllAssignmentsFor", volunteer.id);
      dispatch("fetchPotentialAssignmentsFor", volunteer.id);
      dispatch("user/getVolunteerAssignmentStats", volunteer.id, {
        root: true,
      });
    },

    async unassign(
      { state, dispatch },
      { assignmentIdentifier, assigneeId }: UnassignForm,
    ) {
      const repository = new AssignmentsRepository(this);
      await repository.unassign(assignmentIdentifier, assigneeId);

      dispatch("fetchVolunteers");
      dispatch("fetchAssignmentDetails", assignmentIdentifier);
      if (!state.selectedVolunteer) return;
      dispatch("fetchAllAssignmentsFor", state.selectedVolunteer.id);
      dispatch("fetchPotentialAssignmentsFor", state.selectedVolunteer.id);
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
