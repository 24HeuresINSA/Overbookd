import { actionTree, getterTree, mutationTree } from "typed-vuex";
import {
  AssignmentCandidate,
  TaskAssignment,
} from "~/domain/timespan-assignment/timespanAssignment";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { Volunteer } from "~/utils/models/assignment";
import {
  FtTimespan,
  FtWithTimespan,
  TimespanWithFt,
  castFtsWithTimespansWithDate,
  castTimespansWithFtWithDate,
  FtTimespanWithRequestedTeams,
} from "~/utils/models/ftTimespan";
import {
  castVolunteerTaskWithDate,
  User,
  VolunteerTask,
} from "~/utils/models/user";

const UserRepo = RepoFactory.userRepo;
const AssignmentRepo = RepoFactory.AssignmentRepository;

export const state = () => ({
  volunteers: [] as Volunteer[],
  timespans: [] as TimespanWithFt[],
  fts: [] as FtWithTimespan[],

  selectedVolunteer: null as Volunteer | null,
  selectedVolunteerFriends: [] as User[],
  selectedTimespan: null as FtTimespan | null,
  selectedFt: null as FtWithTimespan | null,
  selectedFtTimespans: [] as FtTimespanWithRequestedTeams[],

  taskAssignment: TaskAssignment.init(),

  hoverTimespan: null as TimespanWithFt | null,
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

  SET_SELECTED_TIMESPAN(state, timespan: FtTimespan) {
    state.selectedTimespan = timespan;
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
    state.taskAssignment = TaskAssignment.init({
      ...state.selectedTimespan,
      name: state.selectedFt.name,
    }).addCandidate(candidate);
  },

  SET_CANDIDATE_TASKS(
    state,
    { tasks, id }: { tasks: VolunteerTask[]; id: number }
  ) {
    state.taskAssignment.withCandidateTasks(id, tasks);
  },

  RESET_TIMESPAN_ASSIGNMENT(state) {
    state.taskAssignment = TaskAssignment.init();
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

    setSelectedTimespan({ commit, dispatch }, timespan: FtTimespan) {
      commit("SET_SELECTED_TIMESPAN", timespan);
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
      commit("SET_FT_TIMESPANS", res.data);
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

    async startAssignment({ commit }, volunteer: Volunteer) {
      commit("SET_SELECTED_VOLUNTEER", volunteer);
      commit("START_TIMESPAN_ASSIGNMENT_WITH_VOLUNTEER", volunteer);
      const [userRequestsRes, assignmentRes] = await Promise.all([
        safeCall(this, UserRepo.getUserFtRequests(this, volunteer.id)),
        safeCall(this, UserRepo.getVolunteerAssignments(this, volunteer.id)),
      ]);
      const tasks = castVolunteerTaskWithDate([
        ...(userRequestsRes?.data ?? []),
        ...(assignmentRes?.data ?? []),
      ]);
      commit("SET_CANDIDATE_TASKS", { id: volunteer.id, tasks });
    },

    resetAssignment({ commit }) {
      commit("RESET_TIMESPAN_ASSIGNMENT");
    },
  }
);
