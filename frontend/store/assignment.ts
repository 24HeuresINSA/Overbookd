import { actionTree, getterTree, mutationTree } from "typed-vuex";
import { safeCall } from "~/utils/api/calls";
import { RepoFactory } from "~/repositories/repoFactory";
import { User } from "~/utils/models/repo";
import { FT } from "~/utils/models/FT";
import { FA } from "~/utils/models/FA";
import Fuse from "fuse.js";
import { TimeSpan } from "~/utils/models/TimeSpan";
import TimeSpanRepo from "~/repositories/timeSpanRepo";
import user from "~/middleware/user";

declare interface filter {
  user: {
    search: string;
    team: string;
    sortBy: {
      isAscending: boolean;
      field: string;
    };
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
      sortBy: {
        isAscending: false,
        field: "charisma",
      },
    },
    FT: {
      search: "",
    },
    isModeOrgaToTache: false,
  } as filter,
  selectedUser: {} as User,
  selectedTimeSpan: {} as TimeSpan, // Selected TimeSpan from the calendar
  FTs: [] as FT[],
  FAs: [] as FA[],
  timeslots: [] as any[],
  timespans: [] as TimeSpan[],
  assignedTimespans: [] as TimeSpan[],
  timespanToFTName: {} as { [key: string]: string },
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
  SET_TIMESPANS(state: any, data: any) {
    state.timespans = data;
  },
  SET_ASSIGN_TIMESPANS(state: any, data: any) {
    state.assignedTimespans = data;
  },
  SET_ASSIGNMENT(state: any, assignedTimeSpan: TimeSpan) {
    // const timeSpanIndex = state.timespans.findIndex(
    //   (ts: TimeSpan) => ts._id === assignedTimeSpan._id
    // );
    // state.timespans.splice(timeSpanIndex, 1, assignedTimeSpan);
    state.assignedTimespans.push(assignedTimeSpan);
  },
  SET_SELECTED_TIMESPAN(state: any, data: TimeSpan) {
    state.selectedTimeSpan = data;
  },
  ADD_ASSIGNED_TIMESPAN(state: any, data: TimeSpan) {
    state.assignedTimespans.push(data);
  },
  ADD_AVAILABLE_TIMESPAN(state: any, data: TimeSpan) {
    state.timespans.push(data);
  },
  REMOVE_AVAILAIBLE_TIMESPAN(state: any, data: TimeSpan) {
    const timeSpanIndex = state.timespans.findIndex(
      (ts: TimeSpan) => ts._id === data._id
    );
    state.timespans.splice(timeSpanIndex, 1);
  },
  REMOVE_ASSIGNED_TIMESPAN(state: any, data: TimeSpan) {
    const timeSpanIndex = state.assignedTimespans.findIndex(
      (ts: TimeSpan) => ts._id === data._id
    );
    state.assignedTimespans.splice(timeSpanIndex, 1);
  },
  CHANGE_MODE(state: any, data: boolean) {
    state.filters.isModeOrgaToTache = data;
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
        let users = ret.data as User[];
        // filter useless users
        users = users.filter((user: User) => user.team.length > 0);
        commit("SET_USERS", users);
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
        commit("SET_FTs", ret.data.data);
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

    async selectTimeSpan({ commit }: any, timeSpan: TimeSpan) {
      commit("SET_SELECTED_TIMESPAN", timeSpan);
    },

    changeMode({ commit }: any, isModeOrgaToTache: boolean) {
      commit("CHANGE_MODE", isModeOrgaToTache || false);
    },

    /**
     * get all timespans
     */
    async getTimespans({ commit, state }: any) {
      const ret = await safeCall(this, TimeSpanRepo.getAll(this));
      if (ret) {
        commit(
          "SET_TIMESPANS",
          ret.data.map((ts: any) => ({
            ...ts,
            start: new Date(ts.start),
            end: new Date(ts.end),
            timed: true,
            FTName: state.FTs.find((ft: FT) => ft.count === ts.FTID)?.general
              .name,
          }))
        );
      }
      return ret;
    },
    async getUserAssignedTimespans({ commit, state }: any, user: User) {
      const ret = await safeCall(
        this,
        TimeSpanRepo.getUserAssignedTimespans(this, user._id)
      );
      if (ret) {
        commit(
          "SET_ASSIGN_TIMESPANS",
          ret.data.map((ts: any) => ({
            ...ts,
            start: new Date(ts.start),
            end: new Date(ts.end),
            timed: true,
            FTName: state.FTs.find((ft: FT) => ft.count === ts.FTID)?.general
              .name,
          }))
        );
      }
      return ret;
    },

    async getAvailableTimespansForUser({ commit, state }: any, user: User) {
      const ret = await safeCall(
        this,
        TimeSpanRepo.getAvailableTimespansForUser(this, user._id)
      );
      if (ret) {
        commit(
          "SET_TIMESPANS",
          ret.data.map((ts: any) => ({
            ...ts,
            start: new Date(ts.start),
            end: new Date(ts.end),
            timed: true,
            FTName: state.FTs.find((ft: FT) => ft.count === ts.FTID)?.general
              .name,
          }))
        );
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

    async initStore({ dispatch, state }) {
      await dispatch("getUsers");
      await dispatch("getFTs");
      await dispatch("getFAs");
      await dispatch("getTimeslots");
      await dispatch("getTimespans");
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

    getFTNameById({ state }: any, id: string) {
      const ft = state.FTs.find((ft: FT) => {
        if (ft.timeframes.length > 0) {
          let res = false;
          ft.timeframes.forEach((tf: any) => {
            if (tf._id === id) {
              res = true;
            }
          });
          return res;
        }
      });
      return ft ? ft.general.name : "";
    },

    /**
     * assign user to timespan
     */
    async assignUserToTimespan(
      { commit, state }: any,
      data: { userID: string; timespanID: string }
    ) {
      const res = await safeCall(
        this,
        TimeSpanRepo.assignUserToTimespan(this, data.userID, data.timespanID)
      );
      if (res) {
        const assignedTimeSpan = {
          ...state.timespans.find((ts: TimeSpan) => ts._id === res.data._id),
        };
        assignedTimeSpan.assigned = res.data.assigned;
        commit("ADD_ASSIGNED_TIMESPAN", assignedTimeSpan);
        commit("REMOVE_AVAILAIBLE_TIMESPAN", assignedTimeSpan);
      }
    },

    /**
     * unassign user from timespan
     */
    async unassign({ commit, state }: any, timeSpanID: string) {
      const res = await safeCall(
        this,
        TimeSpanRepo.unassignUserFromTimespan(this, timeSpanID)
      );
      if (res) {
        const assignedTimeSpan = {
          ...state.assignedTimespans.find(
            (ts: TimeSpan) => ts._id === res.data._id
          ),
        };
        assignedTimeSpan.assigned = res.data.assigned;
        commit("ADD_AVAILABLE_TIMESPAN", assignedTimeSpan);
        commit("REMOVE_ASSIGNED_TIMESPAN", assignedTimeSpan);
      }
    },
  }
);

export const getters = getterTree(state, {
  filteredUsers: (state: any) => {
    // filter users by filters and search
    const { user } = state.filters;
    const { search, team } = user;
    let users = [...state.users];

    if (search && search.length > 0) {
      const options = {
        // Search in `author` and in `tags` array
        keys: ["firstname", "lastname"],
        threshold: 0.4,
      };
      const fuse = new Fuse(users, options);
      users = fuse.search(search).map((e) => e.item);
    }
    if (team && team.length > 0) {
      users = users.filter((user: User) => {
        if (user.team) {
          const userTeams = user.team as string[];
          return userTeams.filter((v) => team.includes(v)).length > 0;
        }
        return false;
      });
    }

    if (user.sortBy.field) {
      users = users.sort((a: User, b: User) => {
        // @ts-ignore
        if (a[user.sortBy.field] < b[user.sortBy.field]) {
          return user.sortBy.isAscending ? -1 : 1;
        }
        // @ts-ignore
        if (a[user.sortBy.field] > b[user.sortBy.field]) {
          return user.sortBy.isAscending ? 1 : -1;
        }
        return 0;
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

  availableTimeSpans: (state: any, getters: any) => {
    // const { selectedUser } = state;
    // if (selectedUser && state.timespans) {
    //   console.log(selectedUser);
    //   console.log(state.timespans);
    //   let availableTimeSpans = state.timespans.filter((ts: any) => {
    //     let isAvailable = false;
    //     getters.selectedUserAvailabilities.forEach((av: any) => {
    //       if (!av) {
    //         return;
    //       }
    //       if (
    //         new Date(av.timeFrame.start).getTime() <=
    //           new Date(ts.start).getTime() &&
    //         new Date(av.timeFrame.end).getTime() >= new Date(ts.end).getTime()
    //       ) {
    //         isAvailable = true;
    //       }
    //     });
    //     return isAvailable;
    //   });
    //   availableTimeSpans.filter((ts: any) => {
    //     const requirement = ts.required;
    //     if (requirement.type === "user") {
    //       return requirement.user._id === selectedUser._id;
    //     } else if (requirement.type === "team") {
    //       return selectedUser.team.includes(requirement.team);
    //     }
    //   });
    //   // filter only avaialble timespans
    //   availableTimeSpans = availableTimeSpans.filter(
    //     (ts: TimeSpan) => !ts.assigned
    //   );
    //   return availableTimeSpans;
    // }
    // return [];

    //TODO: filter with future timespans filter
    return state.timespans;
  },
});

/**
 * resolve FT id with name
 */
function getFTNameById(FTs: any, id: string) {
  const ft = FTs.find((ft: FT) => {
    if (ft.timeframes.length > 0) {
      let res = false;
      ft.timeframes.forEach((tf: any) => {
        if (tf._id === id) {
          res = true;
        }
      });
      return res;
    }
  });
  return ft ? ft.general.name : "";
}
