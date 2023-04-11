import { actionTree, getterTree, mutationTree } from "typed-vuex";
import {
  AssignmentCandidate,
  TaskAssignment,
} from "~/domain/timespan-assignment/timespanAssignment";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  AssignmentModes,
  Volunteer,
  getAssignmentModeFromRoute,
} from "~/utils/models/assignment";
import {
  FtTimespan,
  FtTimespanWithRequestedTeams,
  FtWithTimespan,
  TimespanWithAssignees,
  TimespanWithFt,
  castFtsWithTimespansWithDate,
  castTimespansWithFtWithDate,
} from "~/utils/models/ftTimespan";
import {
  User,
  VolunteerTask,
  castVolunteerTaskWithDate,
} from "~/utils/models/user";
import { HttpStringified } from "~/utils/types/http";

type AssignmentParameters = {
  volunteerId: number;
  teamCode: string;
};

export type AssignmentRequest = {
  timespanId: number;
  teamCode: string;
  volunteerId: number;
};

const UserRepo = RepoFactory.userRepo;
const AssignmentRepo = RepoFactory.AssignmentRepository;

export const state = () => ({
  volunteers: [] as Volunteer[],
  timespans: [] as TimespanWithFt[],
  fts: [] as FtWithTimespan[],

  selectedVolunteer: null as Volunteer | null,
  selectedVolunteerFriends: [] as User[],
  selectedTimespan: null as FtTimespanWithRequestedTeams | null,
  selectedFt: null as FtWithTimespan | null,
  selectedFtTimespans: [] as FtTimespanWithRequestedTeams[],

  taskAssignment: TaskAssignment.init(),

  hoverTimespan: null as TimespanWithFt | null,
  timespanToDisplayDetails: null as TimespanWithAssignees | null,
});

export const getters = getterTree(state, {
  assignableFts(state) {
    return state.fts.filter((ft) => {
      return ft.timespans.some((timespan) =>
        timespan.requestedTeams.some(
          (teamRequest) => teamRequest.quantity > teamRequest.assignmentCount
        )
      );
    });
  },
  openTaskAssignmentDialog(state): boolean {
    return state.taskAssignment.candidates.some(
      ({ volunteer }) => volunteer.id === state.selectedVolunteer?.id
    );
  },
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: Volunteer[]) {
    state.volunteers = volunteers;
  },

  SET_TIMESPANS(state, timespansWithFt: TimespanWithFt[]) {
    state.timespans = timespansWithFt;
  },

  SET_FTS(state, ftWithTimespans: FtWithTimespan[]) {
    state.fts = ftWithTimespans;
  },

  SET_FT_TIMESPANS(state, timespans: FtTimespanWithRequestedTeams[]) {
    state.selectedFtTimespans = timespans;
  },

  SET_SELECTED_VOLUNTEER(state, volunteer: Volunteer) {
    state.selectedVolunteer = volunteer;
  },

  SET_SELECTED_VOLUNTEER_FRIENDS(state, friends: User[]) {
    state.selectedVolunteerFriends = friends;
  },

  SET_SELECTED_TIMESPAN(state, timespan: FtTimespanWithRequestedTeams) {
    state.selectedTimespan = timespan;
  },

  SET_TIMESPAN_TO_DISPLAY_DETAILS(state, timespan: TimespanWithAssignees) {
    state.timespanToDisplayDetails = timespan;
  },

  SET_SELECTED_FT(state, ft: FtWithTimespan) {
    state.selectedFt = ft;
  },

  SET_HOVER_TIMESPAN(state, timespan: TimespanWithFt | null) {
    state.hoverTimespan = timespan;
  },

  START_TIMESPAN_ASSIGNMENT_WITH_VOLUNTEER(state, volunteer: Volunteer) {
    if (!state.selectedFt || !state.selectedTimespan) return;

    const candidate = new AssignmentCandidate(volunteer);
    const teamRequests = state.selectedTimespan.requestedTeams.map(
      ({ assignmentCount, code, quantity }) => ({
        quantity,
        teamCode: code,
        assignments: assignmentCount,
      })
    );

    state.taskAssignment = TaskAssignment.init({
      ...state.selectedTimespan,
      name: state.selectedFt.name,
    })
      .withRemaingTeamRequests(teamRequests)
      .addCandidate(candidate);
  },

  SET_CANDIDATE_TASKS(
    state,
    { tasks, id }: { tasks: VolunteerTask[]; id: number }
  ) {
    state.taskAssignment.withCandidateTasks(id, tasks);
  },

  SET_CANDIDATES_FRIENDS(state, friends: Volunteer[]) {
    state.taskAssignment = state.taskAssignment.withCandidatesFriends(friends);
  },

  ASSIGN_VOLUNTEER_AS_MEMBER_OF(
    state,
    { volunteerId, teamCode }: AssignmentParameters
  ) {
    state.taskAssignment.assignCandidate(volunteerId, teamCode);
  },

  UNASSIGN_VOLUNTEER(state, volunteerId: number) {
    state.taskAssignment.unassignCandidate(volunteerId);
  },

  RESET_TIMESPAN_ASSIGNMENT(state) {
    state.taskAssignment = TaskAssignment.init();
  },

  ADD_CANDIDATE(state, volunteer: Volunteer) {
    const candidate = new AssignmentCandidate(volunteer);
    state.taskAssignment = state.taskAssignment.addCandidate(candidate);
  },

  SET_PREVIOUS_CANDIDATE(state) {
    state.taskAssignment =
      state.taskAssignment.changeLastCandidateToPreviousFriend();
  },

  SET_NEXT_CANDIDATE(state) {
    state.taskAssignment =
      state.taskAssignment.changeLastCandidateToNextFriend();
  },
});

export const actions = actionTree(
  { state },
  {
    clearSelectedVariables({ commit, dispatch }) {
      commit("SET_SELECTED_VOLUNTEER", null);
      commit("SET_SELECTED_VOLUNTEER_FRIENDS", []);
      commit("SET_SELECTED_TIMESPAN", null);
      commit("SET_SELECTED_FT", null);
      commit("SET_HOVER_TIMESPAN", null);
      dispatch("volunteerAvailability/clearVolunteerAvailabilities", null, {
        root: true,
      });
    },

    async fetchVolunteers({ commit }) {
      const res = await safeCall(this, AssignmentRepo.getVolunteers(this));
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },

    setSelectedVolunteer({ commit, dispatch }, volunteer: Volunteer) {
      commit("SET_SELECTED_VOLUNTEER", volunteer);
      dispatch("fetchTimespansForVolunteer", volunteer.id);
      dispatch(
        "volunteerAvailability/fetchVolunteerAvailabilities",
        volunteer.id,
        { root: true }
      );
    },

    setSelectedTimespan({ commit, dispatch, state }, timespan: FtTimespan) {
      const selectedTimespan = state.selectedFtTimespans.find(
        (selectedTimespan) => selectedTimespan.id === timespan.id
      );
      if (!selectedTimespan) return;
      commit("SET_SELECTED_TIMESPAN", {
        ...timespan,
        requestedTams: selectedTimespan.requestedTeams,
      });
      dispatch("fetchVolunteersForTimespan", timespan.id);
    },

    setSelectedFt({ commit }, ft: FtWithTimespan) {
      commit("SET_SELECTED_FT", ft);
    },

    setVolunteers({ commit }, volunteers: Volunteer[]) {
      commit("SET_VOLUNTEERS", volunteers);
    },

    async fetchFtsWithTimespans({ commit }) {
      const res = await safeCall(this, AssignmentRepo.getFtWithTimespans(this));
      if (!res) return;
      commit("SET_FTS", castFtsWithTimespansWithDate(res.data));
    },

    async fetchTimespansWithStats({ commit }, ftId: number) {
      const res = await safeCall(
        this,
        AssignmentRepo.getTimespansWithStats(this, ftId)
      );
      if (!res) return;
      const timespans = convertToTimespans(res.data);
      commit("SET_FT_TIMESPANS", timespans);
    },

    async fetchTimespansForVolunteer({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        AssignmentRepo.getTimespansForVolunteer(this, volunteerId)
      );
      if (!res) return;
      commit("SET_TIMESPANS", castTimespansWithFtWithDate(res.data));
    },

    async fetchVolunteersForTimespan({ commit }, timespanId: number) {
      const res = await safeCall(
        this,
        AssignmentRepo.getVolunteersForTimespan(this, timespanId)
      );
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },

    async fetchSelectedVolunteerFriends({ commit }, id: number) {
      const res = await safeCall(this, UserRepo.getUserFriends(this, id));
      if (!res) return;
      commit("SET_SELECTED_VOLUNTEER_FRIENDS", res.data);
    },

    setHoverTimespan({ commit }, timespan: TimespanWithFt | null) {
      commit("SET_HOVER_TIMESPAN", timespan);
    },

    startAssignment({ commit, dispatch }, volunteer: Volunteer) {
      commit("SET_SELECTED_VOLUNTEER", volunteer);
      commit("START_TIMESPAN_ASSIGNMENT_WITH_VOLUNTEER", volunteer);
      dispatch("retrieveVolunteerRelatedData", volunteer.id);
    },

    async retrieveVolunteerRelatedData({ commit, state }, volunteerId: number) {
      const [userRequestsRes, assignmentRes, ...volunteerFriendsRes] =
        await Promise.all([
          safeCall(this, UserRepo.getUserFtRequests(this, volunteerId)),
          safeCall(this, UserRepo.getVolunteerAssignments(this, volunteerId)),
          ...state.taskAssignment.candidateToRetrieveFriendsFor.map(
            ({ volunteer }) =>
              safeCall(
                this,
                AssignmentRepo.getAvailableFriends(
                  this,
                  volunteer.id,
                  state.selectedTimespan?.id ?? 0
                )
              )
          ),
        ]);
      const tasks = castVolunteerTaskWithDate([
        ...(userRequestsRes?.data ?? []),
        ...(assignmentRes?.data ?? []),
      ]);
      commit("SET_CANDIDATE_TASKS", { id: volunteerId, tasks });
      const candidateFriends = volunteerFriendsRes.flatMap(
        (res) => res?.data ?? []
      );
      commit("SET_CANDIDATES_FRIENDS", candidateFriends);
    },

    resetAssignment({ commit }) {
      commit("RESET_TIMESPAN_ASSIGNMENT");
    },

    assign({ commit }, assignment: AssignmentParameters) {
      commit("ASSIGN_VOLUNTEER_AS_MEMBER_OF", assignment);
    },

    unassign({ commit }, volunteerId: number) {
      commit("UNASSIGN_VOLUNTEER", volunteerId);
    },

    async saveAssignment({ dispatch }, assignment: AssignmentRequest) {
      const res = await safeCall(this, AssignmentRepo.assign(this, assignment));
      if (!res) return;
      dispatch("fetchTimespansForVolunteer", assignment.volunteerId);
      dispatch("fetchVolunteers");
    },

    async saveAssignments({ state, dispatch, commit }) {
      const assignmentsRes = await Promise.all(
        state.taskAssignment.assignments.map((assignment) =>
          safeCall(this, AssignmentRepo.assign(this, assignment))
        )
      );
      if (assignmentsRes.some((res) => res === undefined)) {
        const notif = {
          message:
            "Toutes les affectations n'ont pas eu lieu. Regardez le détails du créneau.",
        };
        dispatch("notif/pushNotification", notif);
        return;
      }
      commit("SET_SELECTED_VOLUNTEER", null);
      await dispatch("fetchTimespansWithStats", state.selectedFt?.id);
      const updatedTimespan = state.selectedFtTimespans.find(
        (timespan) => timespan.id === state.selectedTimespan?.id
      );
      if (!updatedTimespan) return;
      dispatch("setSelectedTimespan", updatedTimespan);
    },

    async unassignVolunteer(
      { dispatch },
      { timespanId, assigneeId }: { timespanId: number; assigneeId: number }
    ) {
      const res = await safeCall(
        this,
        AssignmentRepo.unassign(this, timespanId, assigneeId),
        {
          successMessage: "Le bénévole a été désaffecté 🥳",
          errorMessage: "Le bénévole n'a pas pu être désaffecté 😢",
        }
      );
      if (!res) return;
      dispatch("fetchTimespanDetails", timespanId);
      const route = this.$router.currentRoute.fullPath;
      const isOrgaTaskMode =
        getAssignmentModeFromRoute(route) === AssignmentModes.ORGA_TASK;

      if (isOrgaTaskMode) {
        return dispatch("fetchTimespansForVolunteer", assigneeId);
      }
      return dispatch("fetchVolunteersForTimespan", timespanId);
    },

    async addCandidate({ state, commit, dispatch }) {
      const volunteer = state.taskAssignment.candidateFriends.at(0);
      if (!volunteer) return;
      commit("ADD_CANDIDATE", volunteer);
      dispatch("retrieveVolunteerRelatedData", volunteer.id);
    },

    previousCandidate({ commit, dispatch }) {
      commit("SET_PREVIOUS_CANDIDATE");
      dispatch("retrieveLastCandidateRelatedData");
    },

    nextCandidate({ commit, dispatch }) {
      commit("SET_NEXT_CANDIDATE");
      dispatch("retrieveLastCandidateRelatedData");
    },

    retrieveLastCandidateRelatedData({ state, dispatch }) {
      const lastCandidate = state.taskAssignment.candidates.at(-1);
      if (!lastCandidate) return;
      dispatch("retrieveVolunteerRelatedData", lastCandidate.volunteer.id);
    },

    async fetchTimespanDetails({ commit }, timespanId: number) {
      const res = await safeCall(
        this,
        AssignmentRepo.getTimespanDetails(this, timespanId)
      );
      if (!res) return;
      const timespan = convertToTimespanWithAssignees(res.data);
      commit("SET_TIMESPAN_TO_DISPLAY_DETAILS", timespan);
    },
  }
);

function convertToTimespans(
  timespans: HttpStringified<FtTimespanWithRequestedTeams>[]
): FtTimespanWithRequestedTeams[] {
  return timespans.map((timespan) => ({
    ...timespan,
    start: new Date(timespan.start),
    end: new Date(timespan.end),
  }));
}

function convertToTimespanWithAssignees(
  timespan: HttpStringified<TimespanWithAssignees>
): TimespanWithAssignees {
  return {
    ...timespan,
    start: new Date(timespan.start),
    end: new Date(timespan.end),
  };
}
