import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { Period } from "@overbookd/period";
import {
  AssignmentCandidate,
  TaskAssignment,
} from "~/domain/timespan-assignment/timeSpanAssignment";
import { safeCall } from "~/utils/api/calls";
import {
  AssignmentModes,
  UpdateAssignedTeam,
  Volunteer,
  getAssignmentModeFromRoute,
} from "~/utils/models/assignment.model";
import {
  AvailableTimeSpan,
  FtTimeSpan,
  FtTimeSpanWithRequestedTeams,
  FtWithTimeSpan,
  TimeSpanWithAssignees,
  castAvailableTimeSpansWithDate,
} from "~/utils/models/ft-time-span.model";
import {
  VolunteerAssignmentStat,
  VolunteerTask,
  castVolunteerTaskWithDate,
} from "~/utils/models/user.model";
import { HttpStringified } from "@overbookd/http";
import { User } from "@overbookd/user";
import { AssignmentRepository } from "~/repositories/assignment/assignment.repository";
import { UserRepository } from "~/repositories/user.repository";
import { VolunteerAvailabilityRepository } from "~/repositories/volunteer-availability.repository";
import { castPeriodsWithDate } from "~/utils/http/period";

type AssignmentParameters = {
  volunteerId: number;
  teamCode: string;
};

type AssignmentRequest = {
  volunteerId: number;
  teamCode: string;
  timeSpanId: number;
};

export type BulkAssignmentRequest = {
  volunteers: { id: number; teamCode: string }[];
  timeSpanId: number;
};

export type AssignmentStats = {
  firstname: string;
  lastname: string;
  stats: VolunteerAssignmentStat[];
};

type State = {
  volunteers: Volunteer[];
  timeSpans: AvailableTimeSpan[];
  fts: FtWithTimeSpan[];
  selectedVolunteer: Volunteer | null;
  selectedVolunteerFriends: User[];
  selectedTimeSpan: FtTimeSpanWithRequestedTeams | null;
  selectedFt: FtWithTimeSpan | null;
  selectedFtTimeSpans: FtTimeSpanWithRequestedTeams[];
  taskAssignment: TaskAssignment;
  hoverTimeSpan: AvailableTimeSpan | null;
  timeSpanToDisplayDetails: TimeSpanWithAssignees | null;
  stats: AssignmentStats[];
};

export const state = (): State => ({
  volunteers: [],
  timeSpans: [] as AvailableTimeSpan[], // OLD
  fts: [] as FtWithTimeSpan[], // OLD

  selectedVolunteer: null as Volunteer | null,
  selectedVolunteerFriends: [] as User[],
  selectedTimeSpan: null as FtTimeSpanWithRequestedTeams | null,
  selectedFt: null as FtWithTimeSpan | null,
  selectedFtTimeSpans: [] as FtTimeSpanWithRequestedTeams[],

  taskAssignment: TaskAssignment.init(),

  hoverTimeSpan: null as AvailableTimeSpan | null,
  timeSpanToDisplayDetails: null as TimeSpanWithAssignees | null,

  stats: [] as AssignmentStats[],
});

export const getters = getterTree(state, {
  openTaskAssignmentDialog(state): boolean {
    return state.taskAssignment.candidates.some(
      ({ volunteer }) => volunteer.id === state.selectedVolunteer?.id,
    );
  },
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: Volunteer[]) {
    state.volunteers = volunteers;
  },

  SET_TIMESPANS(state, timeSpansWithFt: AvailableTimeSpan[]) {
    state.timeSpans = timeSpansWithFt;
  },

  SET_FTS(state, ftWithTimeSpans: FtWithTimeSpan[]) {
    state.fts = ftWithTimeSpans;
  },

  SET_FT_TIMESPANS(state, timeSpans: FtTimeSpanWithRequestedTeams[]) {
    state.selectedFtTimeSpans = timeSpans;
  },

  SET_SELECTED_VOLUNTEER(state, volunteer: Volunteer) {
    state.selectedVolunteer = volunteer;
  },

  SET_SELECTED_VOLUNTEER_FRIENDS(state, friends: User[]) {
    state.selectedVolunteerFriends = friends;
  },

  SET_SELECTED_TIMESPAN(state, timeSpan: FtTimeSpanWithRequestedTeams) {
    state.selectedTimeSpan = timeSpan;
  },

  SET_TIMESPAN_TO_DISPLAY_DETAILS(state, timeSpan: TimeSpanWithAssignees) {
    state.timeSpanToDisplayDetails = timeSpan;
  },

  SET_SELECTED_FT(state, ft: FtWithTimeSpan) {
    state.selectedFt = ft;
  },

  SET_HOVER_TIMESPAN(state, timeSpan: AvailableTimeSpan | null) {
    state.hoverTimeSpan = timeSpan;
  },

  START_TIMESPAN_ASSIGNMENT_WITH_VOLUNTEER(state, volunteer: Volunteer) {
    if (!state.selectedFt || !state.selectedTimeSpan) return;

    const candidate = new AssignmentCandidate(volunteer);
    const teamRequests = state.selectedTimeSpan.requestedTeams.map(
      ({ assignmentCount, code, quantity }) => ({
        quantity,
        teamCode: code,
        assignments: assignmentCount,
      }),
    );

    state.taskAssignment = TaskAssignment.init({
      ...state.selectedTimeSpan,
      name: state.selectedFt.name,
    })
      .withRemaingTeamRequests(teamRequests)
      .addCandidate(candidate);
  },

  SET_CANDIDATE_TASKS(
    state,
    { tasks, id }: { tasks: VolunteerTask[]; id: number },
  ) {
    state.taskAssignment.withCandidateTasks(id, tasks);
  },

  SET_CANDIDATES_FRIENDS(state, friends: Volunteer[]) {
    state.taskAssignment = state.taskAssignment.withCandidatesFriends(friends);
  },

  SET_CANDIDATE_AVAILABILITIES(
    state,
    { availabilities, id }: { availabilities: Period[]; id: number },
  ) {
    state.taskAssignment = state.taskAssignment.withCandidateAvailabilities(
      id,
      availabilities,
    );
  },

  ASSIGN_VOLUNTEER_AS_MEMBER_OF(
    state,
    { volunteerId, teamCode }: AssignmentParameters,
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

  REMOVE_LAST_CANDIDATE(state) {
    state.taskAssignment = state.taskAssignment.removeLastCandidate();
  },

  SET_PREVIOUS_CANDIDATE(state) {
    state.taskAssignment =
      state.taskAssignment.changeLastCandidateToPreviousFriend();
  },

  SET_NEXT_CANDIDATE(state) {
    state.taskAssignment =
      state.taskAssignment.changeLastCandidateToNextFriend();
  },

  SET_STATS(state, stats: AssignmentStats[]) {
    state.stats = stats;
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

    setSelectedVolunteer({ commit, dispatch }, volunteer: Volunteer) {
      commit("SET_SELECTED_VOLUNTEER", volunteer);
      dispatch("fetchTimeSpansForVolunteer", volunteer.id);
      dispatch(
        "volunteerAvailability/fetchVolunteerAvailabilities",
        volunteer.id,
        { root: true },
      );
    },

    selectVolunteer({ dispatch }, volunteer: Volunteer) {
      dispatch("setSelectedVolunteer", volunteer);
      dispatch("fetchSelectedVolunteerFriends", volunteer.id);
      dispatch("fetchSelectedVolunteerPlanning", volunteer.id);
      dispatch("user/getVolunteerAssignmentStats", volunteer.id, {
        root: true,
      });
    },

    setSelectedTimeSpan({ commit, dispatch, state }, timeSpan: FtTimeSpan) {
      const selectedTimeSpan = state.selectedFtTimeSpans.find(
        (selectedTimeSpan) => selectedTimeSpan.id === timeSpan.id,
      );
      if (!selectedTimeSpan) return;
      commit("SET_SELECTED_TIMESPAN", {
        ...timeSpan,
        requestedTeams: selectedTimeSpan.requestedTeams,
      });
      dispatch("fetchVolunteersForTimeSpan", timeSpan.id);
    },

    setSelectedFt({ commit }, ft: FtWithTimeSpan) {
      commit("SET_SELECTED_FT", ft);
    },

    setVolunteers({ commit }, volunteers: Volunteer[]) {
      commit("SET_VOLUNTEERS", volunteers);
    },

    async fetchTimeSpansWithStats({ commit }, ftId: number) {
      const res = await safeCall(
        this,
        AssignmentRepository.getTimeSpansWithStats(this, ftId),
      );
      if (!res) return;
      const timeSpans = convertToTimeSpans(res.data);
      commit("SET_FT_TIMESPANS", timeSpans);
    },

    async fetchTimeSpansForVolunteer({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        AssignmentRepository.getTimeSpansForVolunteer(this, volunteerId),
      );
      if (!res) return;
      commit("SET_TIMESPANS", castAvailableTimeSpansWithDate(res.data));
    },

    async fetchVolunteersForTimeSpan({ commit }, timeSpanId: number) {
      const res = await safeCall(
        this,
        AssignmentRepository.getVolunteersForTimeSpan(this, timeSpanId),
      );
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },

    async fetchSelectedVolunteerFriends({ commit }, id: number) {
      const res = await safeCall(this, UserRepository.getUserFriends(this, id));
      if (!res) return;
      commit("SET_SELECTED_VOLUNTEER_FRIENDS", res.data);
    },

    fetchSelectedVolunteerPlanning({ dispatch }, volunteerId: number) {
      dispatch("user/getUserFtRequests", volunteerId, { root: true });
      dispatch("user/getVolunteerAssignments", volunteerId, { root: true });
      dispatch("user/getVolunteerTasks", volunteerId, { root: true });
    },

    setHoverTimeSpan({ commit }, timeSpan: AvailableTimeSpan | null) {
      commit("SET_HOVER_TIMESPAN", timeSpan);
    },

    startAssignment({ commit, dispatch }, volunteer: Volunteer) {
      commit("SET_SELECTED_VOLUNTEER", volunteer);
      commit("START_TIMESPAN_ASSIGNMENT_WITH_VOLUNTEER", volunteer);
      dispatch("retrieveVolunteerRelatedData", volunteer.id);
    },

    async retrieveVolunteerRelatedData({ commit, state }, volunteerId: number) {
      const [userRequestsRes, assignmentRes, availabilitiesRes, _tasks] =
        await Promise.all([
          safeCall(this, UserRepository.getUserFtRequests(this, volunteerId)),
          safeCall(
            this,
            UserRepository.getVolunteerAssignments(this, volunteerId),
          ),
          safeCall(
            this,
            VolunteerAvailabilityRepository.getVolunteerAvailabilities(
              this,
              volunteerId,
            ),
          ),
          safeCall(
            this,
            UserRepository.getMobilizationsVolunteerTakePartOf(
              this,
              volunteerId,
            ),
          ),
        ]);
      const volunteerFriendsRes = await Promise.all(
        state.taskAssignment.candidateToRetrieveFriendsFor.map(
          ({ volunteer }) =>
            safeCall(
              this,
              AssignmentRepository.getAvailableFriends(
                this,
                volunteer.id,
                state.selectedTimeSpan?.id ?? 0,
              ),
            ),
        ),
      );
      const tasks = castVolunteerTaskWithDate([
        ...(userRequestsRes?.data ?? []),
        ...(assignmentRes?.data ?? []),
      ]);
      commit("SET_CANDIDATE_TASKS", { id: volunteerId, tasks });
      const candidateFriends = volunteerFriendsRes.flatMap(
        (res) => res?.data ?? [],
      );
      commit("SET_CANDIDATES_FRIENDS", candidateFriends);
      const availabilities = castPeriodsWithDate(availabilitiesRes?.data ?? []);
      commit("SET_CANDIDATE_AVAILABILITIES", {
        availabilities,
        id: volunteerId,
      });
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

    async saveAssignment(
      { dispatch },
      { volunteerId, timeSpanId, teamCode }: AssignmentRequest,
    ) {
      const bulkRequest = {
        volunteers: [{ id: volunteerId, teamCode }],
        timeSpanId,
      };
      const res = await safeCall(
        this,
        AssignmentRepository.assign(this, bulkRequest),
        {
          successMessage: "Le bénévole a été affecté 🥳",
          errorMessage: "Le bénévole n'a pas pu être affecté 😢",
        },
      );
      if (!res) return;
      dispatch("fetchTimeSpansForVolunteer", volunteerId);
      dispatch("fetchVolunteers");
      dispatch("fetchSelectedVolunteerPlanning", volunteerId);
    },

    async saveAssignments({ state, dispatch, commit }) {
      const assignments = state.taskAssignment.assignments;
      const assignmentsRes = await safeCall(
        this,
        AssignmentRepository.assign(this, assignments),
        {
          successMessage: "Les bénévoles ont été affectés 🥳",
          errorMessage:
            "Une erreur lors de l'affectation est survenue, aucun bénévole n'a été affecté 😢",
        },
      );
      if (!assignmentsRes) {
        return;
      }
      commit("SET_SELECTED_VOLUNTEER", null);
      await dispatch("fetchTimeSpansWithStats", state.selectedFt?.id);
      const updatedTimeSpan = state.selectedFtTimeSpans.find(
        (timeSpan) => timeSpan.id === state.selectedTimeSpan?.id,
      );
      if (!updatedTimeSpan) return;
      dispatch("setSelectedTimeSpan", updatedTimeSpan);
    },

    async unassignVolunteer(
      { state, dispatch },
      { timeSpanId, assigneeId }: { timeSpanId: number; assigneeId: number },
    ) {
      const res = await safeCall(
        this,
        AssignmentRepository.unassign(this, timeSpanId, assigneeId),
        {
          successMessage: "Le bénévole a été désaffecté 🥳",
          errorMessage: "Le bénévole n'a pas pu être désaffecté 😢",
        },
      );
      if (!res) return;
      dispatch("restoreStateAfterTimeSpanDetailsUpdate", {
        timeSpanId,
        volunteerId: state.selectedVolunteer?.id,
      });
    },

    async addCandidate({ state, commit, dispatch }) {
      const volunteer = state.taskAssignment.candidateFriends.at(0);
      if (!volunteer) return;
      commit("ADD_CANDIDATE", volunteer);
      dispatch("retrieveVolunteerRelatedData", volunteer.id);
    },

    removeLastCandidate({ commit, dispatch }) {
      commit("REMOVE_LAST_CANDIDATE");
      dispatch("retrieveLastCandidateRelatedData");
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

    async fetchTimeSpanDetails({ commit }, timeSpanId: number) {
      const res = await safeCall(
        this,
        AssignmentRepository.getTimeSpanDetails(this, timeSpanId),
      );
      if (!res) return;
      const timeSpan = convertToTimeSpanWithAssignees(res.data);
      commit("SET_TIMESPAN_TO_DISPLAY_DETAILS", timeSpan);
    },

    restoreStateAfterTimeSpanDetailsUpdate(
      { state, dispatch },
      { timeSpanId, volunteerId }: { timeSpanId: number; volunteerId?: number },
    ) {
      dispatch("fetchTimeSpanDetails", timeSpanId);

      const route = this.$router.currentRoute.fullPath;
      const isOrgaTaskMode =
        getAssignmentModeFromRoute(route) === AssignmentModes.ORGA_TASK;

      if (isOrgaTaskMode && volunteerId) {
        dispatch("user/getVolunteerAssignments", volunteerId, { root: true });
        dispatch("fetchTimeSpansForVolunteer", volunteerId);
        return;
      }
      dispatch("fetchTimeSpansWithStats", state.selectedFt?.id);
      dispatch("fetchVolunteersForTimeSpan", timeSpanId);
    },

    async updateAssignedTeam(
      { state, dispatch },
      { timeSpanId, assigneeId, team }: UpdateAssignedTeam,
    ) {
      const data = { timeSpanId, assigneeId, team };
      const res = await safeCall(
        this,
        AssignmentRepository.updateAssignedTeam(this, data),
        {
          successMessage: "L'équipe affectée a été mise à jour 🥳",
          errorMessage: "L'équipe affectée n'a pas pu être mise à jour 😢",
        },
      );
      if (!res) return;
      dispatch("restoreStateAfterTimeSpanDetailsUpdate", {
        timeSpanId,
        volunteerId: state.selectedVolunteer?.id,
      });
    },

    async fetchStats({ commit }) {
      const res = await safeCall(this, AssignmentRepository.getStats(this));
      if (!res) return;
      commit("SET_STATS", res.data);
    },
  },
);

function convertToTimeSpans(
  timeSpans: HttpStringified<FtTimeSpanWithRequestedTeams>[],
): FtTimeSpanWithRequestedTeams[] {
  return timeSpans.map((timeSpan) => ({
    ...timeSpan,
    start: new Date(timeSpan.start),
    end: new Date(timeSpan.end),
  }));
}

function convertToTimeSpanWithAssignees(
  timeSpan: HttpStringified<TimeSpanWithAssignees>,
): TimeSpanWithAssignees {
  return {
    ...timeSpan,
    start: new Date(timeSpan.start),
    end: new Date(timeSpan.end),
  };
}
