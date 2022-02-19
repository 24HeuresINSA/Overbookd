import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import { FT } from "~/utils/models/FT";
import { FA } from "~/utils/models/FA";
import Fuse from "fuse.js";

declare interface filter {
  user: {
    search: string;
    team: string;
  };
  FT: {
    search: string;
  };
  isModeOrgaToTache: boolean;
}

export const state = () => ({
  users: [] as User[],
  filters: {
    user: {
      search: "",
      team: "",
    },
    FT: {
      search: "",
    },
    isModeOrgaToTache: false,
  } as filter,
  selectedUser: {} as User,
  FTs: [] as FT[],
  FAs: [] as FA[],
  timeslots: [] as any[],
});

export const mutations = mutationTree(state, {
  SET_USERS(state: any, data: User[]) {
    state.users = data;
  },
  SET_TIMESLOTS(state: any, data: any[]) {
    state.timeslots = data;
  },
  SET_SELECTED_USER(state: any, data: User) {
    state.selectedUser = data;
  },
  SET_FTs(state: any, data: any) {
    state.FTs = data;
  },
  SET_FAs(state: any, data: any) {
    state.FA = data;
  },
  SET_USER_FILTER(state: any, { key, value }) {
    state.filters.user[key] = value;
  },
});

export const actions = actionTree(
  { state },
  {
    /**
     *
     * get all users
     * @returns
     */
    async getUsers({ commit }: any) {
      const ret = await safeCall(this, RepoFactory.userRepo.getAllUsers(this));
      if (ret) {
        commit("SET_USERS", ret.data);
      }
      return ret;
    },
    /**
     * get all FTs
     *
     * @returns
     */
    async getFTs({ commit }: any) {
      const ret = await safeCall(this, RepoFactory.ftRepo.getAllFTs(this));
      if (ret) {
        commit("SET_FTs", ret.data);
      }
      return ret;
    },
    /**
     * get all FAs
     *
     * @returns
     */
    async getFAs({ commit }: any) {
      const ret = await safeCall(this, RepoFactory.faRepo.getAllFAs(this));
      if (ret) {
        commit("SET_FAs", ret.data);
      }
      return ret;
    },

    /**
     * get all timeslots
     *
     * @returns
     */
    async getTimeslots({ commit }: any) {
      const ret = await safeCall(this, RepoFactory.timeslotRepo.getAll(this));
      if (ret) {
        commit("SET_TIMESLOTS", ret.data);
      }
      return ret;
    },

    async initStore({ dispatch }) {
      await dispatch("getUsers");
      await dispatch("getFTs");
      await dispatch("getFAs");
      await dispatch("getTimeslots");
    },

    /**
     * set current user
     */
    setCurrentUser({ commit }: any, user: User) {
      commit("SET_SELECTED_USER", user);
    },

    /**
     * set user filters
     */
    setUserFilter({ commit }: any, data: { key: string; value: string }) {
      commit("SET_USER_FILTER", data);
    },

    /**
     * set selected User
     */
    setSelectedUser({ commit }: any, user: User) {
      commit("SET_SELECTED_USER", user);
    },
  }
);

export const getters = getterTree(state, {
  filteredUsers: (state: any) => {
    // filter users by filters and search
    const { user } = state.filters;
    const { search, team } = user;
    let users = state.users;

    if (search && search.length > 0) {
      const options = {
        // Search in `author` and in `tags` array
        keys: ["firstname", "lastname", "nickname", "phone"],
      };
      const fuse = new Fuse(users, options);
      users = fuse.search(search).map((e) => e.item);
    }

    if (team && team.length > 0) {
      users = users.filter((user: User) => {
        if (user.team) {
          const userTeams = user.team as string[];
          return userTeams.filter((v) => team.includes(v));
        }
        return false;
      });
    }
    return users;
  },

  filteredFTs: (state: any) => {
    // filter FTs by filters and search
    const { FT } = state.filters;
    const { search } = FT;
    let FTs = state.FTs;

    if (search && search.length > 0) {
      const options = {
        // Search in `author` and in `tags` array
        keys: ["name"],
      };
      const fuse = new Fuse(FTs, options);
      FTs = fuse.search(search).map((e) => e.item);
    }

    return FTs;
  },

  selectedUserAvailabilities: (state: any) => {
    const { selectedUser } = state;
    if (selectedUser && selectedUser.availabilities) {
      const availabilities = selectedUser.availabilities as string[];
      return availabilities.map((v) => {
        return state.timeslots.find((e: any) => e._id === v);
      });
    }
    return [];
  },
});
