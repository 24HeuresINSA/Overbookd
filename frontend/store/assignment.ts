import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  AssignmentMode,
  AssignmentModes,
  Volunteer,
} from "~/utils/models/assignment";
import {
  castFtsWithTimespansWithDate,
  castTimespansWithFtWithDate,
  FtTimespan,
  FtWithTimespan,
  TimespanWithFt,
} from "~/utils/models/ftTimespan";
import { User } from "~/utils/models/user";

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

  mode: AssignmentModes.ORGA_TASK as AssignmentMode,
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

  SET_MODE(state, mode: AssignmentMode) {
    state.mode = mode;
  },
});

export const actions = actionTree(
  { state },
  {
    setModeOrgaTask({ commit, dispatch }) {
      commit("SET_MODE", AssignmentModes.ORGA_TASK);
      dispatch("clearSelectedVariables");
    },
    setModeTaskOrga({ commit, dispatch }) {
      commit("SET_MODE", AssignmentModes.TASK_ORGA);
      dispatch("clearSelectedVariables");
    },
    clearSelectedVariables({ commit }) {
      commit("SET_SELECTED_VOLUNTEER", null);
      commit("SET_SELECTED_VOLUNTEER_FRIENDS", []);
      commit("SET_SELECTED_TIMESPAN", null);
      commit("SET_SELECTED_FT", null);
    },
    async fetchVolunteers({ commit }) {
      const res = await safeCall(this, AssignmentRepo.getVolunteers(this));
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },

    setSelectedVolunteer({ commit, dispatch }, volunteer: Volunteer) {
      commit("SET_SELECTED_VOLUNTEER", volunteer);
      dispatch("fetchTimespansForVolunteer", volunteer.id);
    },

    setSelectedTimespan({ commit, dispatch }, timespan: FtTimespan) {
      commit("SET_SELECTED_TIMESPAN", timespan);
      dispatch("fetchVolunteersForTimespan", timespan.id);
    },

    setSelectedFt({ commit }, ft: FtWithTimespan) {
      commit("SET_SELECTED_FT", ft);
    },

    async fetchFtsWithTimespans({ commit }) {
      const res = await safeCall(this, AssignmentRepo.getFtWithTimespans(this));
      if (!res) return;
      commit("SET_FTS", castFtsWithTimespansWithDate(res.data));
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
    updateMode({ commit }, mode: AssignmentMode) {
      commit("SET_MODE", mode);
    },
  }
);
