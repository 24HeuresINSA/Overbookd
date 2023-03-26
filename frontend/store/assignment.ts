import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  AssignmentMode,
  AssignmentModes,
  Volunteer,
} from "~/utils/models/assignment";
import {
  castFtWithTimespansWithDate,
  castTimespansWithFtWithDate,
  FtWithTimespan,
  TimespanWithFt,
} from "~/utils/models/ftTimespan";
import { User } from "~/utils/models/user";

const UserRepo = RepoFactory.userRepo;
const AssignmentRepo = RepoFactory.AssignmentRepository;

export const state = () => ({
  volunteers: [] as Volunteer[],
  timespansWithFt: [] as TimespanWithFt[],
  ftWithTimespans: [] as FtWithTimespan[],

  selectedVolunteer: null as Volunteer | null,
  selectedVolunteerFriends: [] as User[],
  mode: AssignmentModes.ORGA_TASK as AssignmentMode,
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: Volunteer[]) {
    state.volunteers = volunteers;
  },

  SET_TIMESPANS_WITH_FT(state, timespansWithFt: TimespanWithFt[]) {
    state.timespansWithFt = timespansWithFt;
  },

  SET_FT_WITH_TIMESPANS(state, ftWithTimespans: FtWithTimespan[]) {
    state.ftWithTimespans = ftWithTimespans;
  },

  SET_SELECTED_VOLUNTEER(state, volunteer: Volunteer) {
    state.selectedVolunteer = volunteer;
  },

  SET_SELECTED_VOLUNTEER_FRIENDS(state, friends: User[]) {
    state.selectedVolunteerFriends = friends;
  },

  SET_MODE(state, mode: AssignmentMode) {
    state.mode = mode;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteers({ commit }) {
      const res = await safeCall(this, AssignmentRepo.getVolunteers(this));
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },

    setSelectedVolunteer({ commit }, volunteer: Volunteer) {
      commit("SET_SELECTED_VOLUNTEER", volunteer);
    },

    async fetchFtWithTimespans({ commit }) {
      const res = await safeCall(this, AssignmentRepo.getFtWithTimespans(this));
      if (!res) return;
      commit("SET_TIMESPANS_WITH_FT", castFtWithTimespansWithDate(res.data));
    },

    async fetchTimespansForVolunteer({ commit }, volunteerId: number) {
      const res = await safeCall(
        this,
        AssignmentRepo.getTimespansForVolunteer(this, volunteerId)
      );
      if (!res) return;
      commit("SET_FT_WITH_TIMESPANS", castTimespansWithFtWithDate(res.data));
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
