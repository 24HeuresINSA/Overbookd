import {actionTree, getterTree, mutationTree} from "typed-vuex";
import {safeCall} from "~/utils/api/calls";
import {RepoFactory} from "~/repositories/repoFactory";
import {User} from "~/utils/models/repo";
import {FT} from "~/utils/models/FT";
import {FA} from "~/utils/models/FA";
import Fuse from "fuse.js";
import {TimeSpan} from "~/utils/models/TimeSpan";
import TimeSpanRepo from "~/repositories/timeSpanRepo";

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
    team: string[];
  };
  isModeOrgaToTache: boolean;
  bypass: boolean;
}

export const state = () => ({
  users: [] as User[],
  selectedUserIndex: Number,
  filters: {
    user: {
      search: "",
      team: "",
      sortBy: {
        isAscending: false,
        field: "charisma",
      },
      driverLicense: undefined,
    },
    FT: {
      search: "",
      team: [] as string[],
      areAssignedFTsDisplayed: true,
    },
    isModeOrgaToTache: false,
    bypass: false,
  } as filter,
  selectedUser: {} as User, // selected User from the list
  selectedTimeSpan: {} as TimeSpan, // Selected TimeSpan from the calendar
  FTs: [] as FT[],
  FAs: [] as FA[],
  timeslots: [] as any[],
  timespans: [] as TimeSpan[],
  assignedTimespans: [] as TimeSpan[],
  hoverTask: {} as TimeSpan,
  multipleSolidTask: [] as TimeSpan[],
  timespanToFTName: {} as { [key: string]: string },
  roles: {} as { [key: number]: { roles: string[]; isFullyAssigned: boolean } },
  userAssignedToSameTimespan: [] as {
    _id: string;
    firstname: string;
    lastname: string;
    timespanId: string;
  }[],
});

export const mutations = mutationTree(state, {
  SET_USERS(state: any, data: User[]) {
    state.users = data;
  },
  SET_USER_INDEX(state: any, index: number) {
    state.selectedUserIndex = index;
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
  SET_FT_FILTER(state: any, { key, value }) {
    state.filters.FT[key] = value;
  },
  ADD_TEAM_TO_FT_FILTER(state: any, team: string) {
    state.filters.FT.team.push(team);
  },
  REMOVE_TEAM_FROM_FT_FILTER(state: any, team: string) {
    state.filters.FT.team.splice(state.filters.FT.team.indexOf(team), 1);
  },
  SET_TIMESPANS(state: any, data: any) {
    state.timespans = data;
  },
  SET_ROLES(state: any, data: any) {
    state.roles = data;
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
    state.selectedUser = {};
  },
  SET_HOVER_TASK(state: any, data: TimeSpan) {
    state.hoverTask = data;
  },
  SET_MULTIPLE_SOLID_TASK(state: any, data: TimeSpan[]) {
    state.multipleSolidTask = data;
  },
  SET_USER_ASSIGNED_TO_SAME_TIMESPAN(state: any, data: any) {
    state.userAssignedToSameTimespan = data;
    state.userAssignedToSameTimespan.sort((a: any, b: any) => {
      if (a.firstname < b.firstname) {
        return -1;
      }
      if (a.firstname > b.firstname) {
        return 1;
      }
      return 0;
    });
  },
  DELETE_TIMESPAN(state: any, data: TimeSpan) {
    const timeSpanIndex = state.timespans.findIndex(
      (ts: TimeSpan) => ts._id === data._id
    );
    state.timespans.splice(timeSpanIndex, 1);
  },
  TOGGLE_BYPASS(state: any) {
    state.filters.bypass = !state.filters.bypass;
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
      const ret: any = await safeCall(
        this,
        RepoFactory.userRepo.getAllUsers(this)
      );
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
      const ret: any = await safeCall(this, RepoFactory.ftRepo.getAllFTs(this));
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
      const ret: any = await safeCall(this, RepoFactory.faRepo.getAllFAs(this));
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
      commit("SET_MULTIPLE_SOLID_TASK", []);
      commit("SET_ASSIGN_TIMESPANS", []);
      commit("SET_SELECTED_USER", {});
      commit("SET_USER_INDEX", -1);
    },

    /**
     * get all timespans
     */
    async getTimespans({ commit, state }: any) {
      const ret: any = await safeCall(this, TimeSpanRepo.getAll(this));
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
      if (user) {
        const ret: any = await safeCall(
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
      } else {
        commit("SET_ASSIGN_TIMESPANS", []);
      }
    },

    async getAvailableTimespansForUser({ commit, state }: any, user: User) {
      if (user) {
        const ret: any = await safeCall(
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
      }
    },

    /**
     * get all timeslots
     *
     * @returns
     */
    async getTimeslots({ commit }: any) {
      const ret: any = await safeCall(
        this,
        RepoFactory.timeslotRepo.getAll(this)
      );
      if (ret) {
        commit("SET_TIMESLOTS", ret.data);
      }
      return ret;
    },

    async getRolesByFT({ commit }: any) {
      const ret: any = await safeCall(this, TimeSpanRepo.getRolesByFT(this));
      if (ret) {
        commit("SET_ROLES", ret.data);
      }
      return ret;
    },

    async initMode({ commit }: any) {
      commit("CHANGE_MODE", true);
    },

    async initStore({ dispatch }) {
      await dispatch("getUsers");
      await dispatch("getFTs");
      await dispatch("getFAs");
      await dispatch("getTimeslots");
      await dispatch("getTimespans");
      await dispatch("getRolesByFT");
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

    setUserIndex({ commit }: any, index: number) {
      commit("SET_USER_INDEX", index);
    },

    /**
     * set selected User
     */
    setSelectedUser({ commit }: any, user: User) {
      if (user) {
        commit("SET_SELECTED_USER", user);
      } else {
        commit("SET_SELECTED_USER", {});
      }
    },

    setSelectedUserBasedOnId({ state, dispatch }: any, id: string) {
      const selectedUser = state.users.find((u: User) => u._id === id);
      if (!selectedUser) {
        throw new Error(`User ${id} not found in local users`);
      }
      dispatch("setUserIndex", id);
      dispatch("setSelectedUser", selectedUser);
    },

    async setFTTeamFilter({ commit, state }: any, data: string) {
      if (state.filters.FT.team.includes(data)) {
        commit("REMOVE_TEAM_FROM_FT_FILTER", data);
      } else {
        commit("ADD_TEAM_TO_FT_FILTER", data);
      }
    },
    async removeFTTeamFilter({ commit }: any, data: string) {
      commit("REMOVE_TEAM_FROM_FT_FILTER", data);
    },
    async setFTFilter({ commit }: any, data: { key: string; value: string }) {
      commit("SET_FT_FILTER", data);
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
      const res: any = await safeCall(
        this,
        TimeSpanRepo.assignUserToTimespan(this, data.userID, data.timespanID)
      );
      if (res) {
        const assignedTimeSpan = {
          ...state.timespans.find((ts: TimeSpan) => ts._id === res.data._id),
        };
        assignedTimeSpan.assigned = res.data.assigned;
        assignedTimeSpan.color = "primary";
        commit("ADD_ASSIGNED_TIMESPAN", assignedTimeSpan);
        commit("REMOVE_AVAILAIBLE_TIMESPAN", assignedTimeSpan);
        if (!state.filters.isModeOrgaToTache) {
          commit("SET_USER_INDEX", -1);
        }
      }
      return res;
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

    setHoverTask({ commit }: any, timeSpan: TimeSpan) {
      commit("SET_HOVER_TASK", timeSpan);
    },

    async setMultipleSolidTask({ commit, state }: any, ft: FT) {
      if (ft !== undefined) {
        const ftTimespans = await TimeSpanRepo.getTimeSpanByFTID(
          this,
          ft.count.toString()
        );
        const timespanCompletion =
          await TimeSpanRepo.getTotalNumberOfTimespansAndAssignedTimespansByFTID(
            this,
            ft.count.toString()
          );
        if (ftTimespans && timespanCompletion) {
          const tosend = ftTimespans.data.map((ts: any) => ({
            ...ts,
            start: new Date(ts.start),
            end: new Date(ts.end),
            timed: true,
            FTName: getFTName(
              [...state.timespans, ...state.assignedTimespans],
              ts,
              timespanCompletion.data,
              ft.general?.name || ""
            ),
          }));
          commit("SET_MULTIPLE_SOLID_TASK", tosend);
        }
      }
    },

    async filterAvailableUserForTimeSpan(
      { commit, state }: any,
      timeSpan: TimeSpan
    ) {
      const usersData = await safeCall(
        this,
        TimeSpanRepo.getAvailableUserForTimeSpan(
          this,
          timeSpan._id,
          state.filters.bypass
        )
      );
      if (usersData) {
        commit("SET_USERS", usersData.data);
      }
    },

    //get user assigned to same timespan
    async getUserAssignedToSameTimespan({ commit }: any, timeSpan: TimeSpan) {
      const res = await safeCall(
        this,
        TimeSpanRepo.getUserAssignedToSameTimespan(this, timeSpan._id)
      );
      if (res) {
        commit("SET_USER_ASSIGNED_TO_SAME_TIMESPAN", res.data);
      }
      return res;
    },

    async deleteTimespan({ commit }: any, timeSpan: TimeSpan) {
      const res = await safeCall(
        this,
        TimeSpanRepo.deleteTimespan(this, timeSpan._id)
      );
      if (res) {
        commit("DELETE_TIMESPAN", timeSpan);
      }
      return res;
    },

    toggleBypass({ commit }: any) {
      commit("TOGGLE_BYPASS");
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
        keys: ["firstname", "lastname", "nickname", "phone"],
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

    if (user.driverLicense) {
      users = users.filter((user: User) => user.hasDriverLicense);
    } else if (user.driverLicense === false) {
      users = users.filter((user: User) => !user.hasDriverLicense);
    }
    return users;
  },

  filteredFTs: (state: any) => {
    // filter FTs by filters and search
    let filtered = state.FTs.filter((item: any) => {
      if (item.general.name !== "" && item.status === "ready") {
        return item;
      }
    });
    const FTFilters = state.filters.FT;
    if (FTFilters.team.length > 0) {
      filtered = filtered.filter((item: any) => {
        for (const team of FTFilters.team) {
          return (
            state.roles[item.count] && state.roles[item.count].includes(team)
          );
        }
      });
    }
    if (FTFilters.search && FTFilters.search.length > 0) {
      const options = {
        // Search in `author` and in `tags` array
        keys: ["general.name", "count"],

        threshold: 0.2,
      };
      const fuse = new Fuse(filtered, options);
      filtered = fuse.search(FTFilters.search).map((e) => e.item);
    }
    if (FTFilters.areAssignedFTsDisplayed) {
      filtered = filtered.filter((ft: FT) => {
        const info = state.roles[ft.count];
        if (info && info.isFullyAssigned) {
          return !info.isFullyAssigned;
        }
        return true;
      });
    }

    return filtered;
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

  availableTimeSpans: (state: any) => {
    const FTFilters = state.filters.FT;
    let filteredTimespans: any = state.timespans;
    if (FTFilters.team.length > 0) {
      filteredTimespans = state.timespans.filter((ts: TimeSpan) => {
        if (!FTFilters.team.includes(ts.required)) {
          return false;
        }
        return true;
      });
    }

    if (FTFilters.search && FTFilters.search.length > 0) {
      const options = {
        // Search in `author` and in `tags` array
        keys: ["FTID", "FTName"],

        threshold: 0.2,
      };
      const fuse = new Fuse(filteredTimespans, options);
      filteredTimespans = fuse.search(FTFilters.search).map((e) => e.item);
    }

    return filteredTimespans;
  },
});

function getFTName(
  allTimeSpans: TimeSpan[],
  timespan: TimeSpan,
  timespanCompletion: { [key: string]: { total: number; assigned: number } },
  name: string
) {
  const ret: any = { assigned: 0, total: 0 };
  const filter = allTimeSpans.filter(
    (ts: TimeSpan) =>
      ts.FTID === timespan.FTID &&
      ts.start.toString() === new Date(timespan.start).toString() &&
      ts.end.toString() === new Date(timespan.end).toString() &&
      ts.required === timespan.required
  );
  filter.forEach((ts: TimeSpan) => {
    ret.assigned += timespanCompletion[ts._id].assigned;
    ret.total += timespanCompletion[ts._id].total;
  });
  return "[" + ret.assigned + "/" + ret.total + "] " + name;
}
