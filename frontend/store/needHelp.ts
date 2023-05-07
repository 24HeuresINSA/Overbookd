import { actionTree, mutationTree, getterTree } from "typed-vuex";
import { SlugifyService } from "~/domain/common/slugify.service";
import { RepoFactory } from "~/repositories/repoFactory";
import { safeCall } from "~/utils/api/calls";
import { ONE_HOUR_IN_MS, QUARTER_IN_MS } from "~/utils/date/dateUtils";
import { Volunteer } from "~/utils/models/needHelp";
import { Period } from "~/utils/models/period";
import { Team } from "~/utils/models/team";
import { DisplayedUser } from "~/utils/models/user";

interface NeedHelpState {
  volunteers: Volunteer[];
  start: Date;
  end: Date;
  search: string;
  teams: Team[];
}

function defaultPeriod() {
  const currentDate = new Date();

  const nextQuarterStep = Math.ceil(currentDate.getTime() / QUARTER_IN_MS);
  const nextQuarterInMs = nextQuarterStep * QUARTER_IN_MS;
  const endPeriodInMs = nextQuarterInMs + ONE_HOUR_IN_MS;

  const start = new Date(nextQuarterInMs);
  const end = new Date(endPeriodInMs);

  return { start, end };
}

const repository = RepoFactory.NeedHelpRepository;

export const state = (): NeedHelpState => ({
  volunteers: [],
  start: defaultPeriod().start,
  end: defaultPeriod().end,
  search: "",
  teams: [],
});

export const getters = getterTree(state, {
  period(state): Period {
    return { start: state.start, end: state.end };
  },
  filteredVolunteers(state): Volunteer[] {
    return state.volunteers.filter(
      (volunteer) =>
        isMatchingName(state.search, volunteer) &&
        isMatchingTeam(state.teams, volunteer)
    );
  },
});

export const mutations = mutationTree(state, {
  SET_VOLUNTEERS(state, volunteers: Volunteer[]) {
    state.volunteers = volunteers;
  },
  SET_START(state, start: Date) {
    state.start = start;
  },
  SET_END(state, end: Date) {
    state.end = end;
  },
  SET_SEARCH(state, search: string) {
    state.search = search;
  },
  SET_TEAMS(state, teams: Team[]) {
    state.teams = teams;
  },
});

export const actions = actionTree(
  { state },
  {
    async fetchVolunteers({ commit, getters }) {
      const res = await safeCall(
        this,
        repository.getAvailableVolunteers(this, getters.period)
      );
      if (!res) return;
      commit("SET_VOLUNTEERS", res.data);
    },
    updatePeriod({ commit, dispatch }, { start, end }: Period) {
      commit("SET_START", start);
      commit("SET_END", end);
      dispatch("fetchVolunteers");
    },
    updateSearch({ commit }, search: string | null) {
      commit("SET_SEARCH", search ?? "");
    },
    updateTeams({ commit }, teams: Team[]) {
      commit("SET_TEAMS", teams);
    },
  }
);

function isMatchingName(
  nameSearch: string,
  { firstname, lastname }: DisplayedUser
) {
  const slugSearch = SlugifyService.apply(nameSearch);
  const slugName = SlugifyService.apply(`${firstname}${lastname}`);
  return slugName.includes(slugSearch);
}

function isMatchingTeam(teamsSearch: Team[], { teams }: { teams: string[] }) {
  if (teamsSearch.length === 0) return true;

  const teamCodes = teamsSearch.map(({ code }) => code);
  return teams.some((team) => teamCodes.includes(team));
}
