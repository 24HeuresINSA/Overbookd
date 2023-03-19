import { actionTree, mutationTree } from "typed-vuex";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import {
  Volunteer,
  AssignmentMode,
  AssignmentModes,
} from "~/utils/models/assignment";
import { User } from "~/utils/models/user";

const UserRepo = RepoFactory.userRepo;
const AssignmentRepo = RepoFactory.AssignmentRepository;

export const state = () => ({
  volunteers: [] as Volunteer[],
  selectedVolunteer: null as Volunteer | null,
  selectedVolunteerFriends: [] as User[],
  mode: AssignmentModes.ORGA_TASK as AssignmentMode,
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: Volunteer[]) {
    state.volunteers = volunteers;
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
