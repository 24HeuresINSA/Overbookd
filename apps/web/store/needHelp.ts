import { actionTree, mutationTree, getterTree } from "typed-vuex";
import {
  IProvidePeriod,
  ONE_HOUR_IN_MS,
  QUARTER_IN_MS,
} from "@overbookd/period";
import { SlugifyService } from "@overbookd/slugify";
import { safeCall } from "~/utils/api/calls";
import { Volunteer } from "~/utils/models/need-help.model";
import { castPeriod } from "~/utils/models/period.model";
import { Team } from "~/utils/models/team.model";
import { castVolunteerTaskWithDate } from "~/utils/models/user.model";
import { UserName } from "@overbookd/user";
import { HttpStringified } from "@overbookd/http";
import { NeedHelpRepository } from "~/repositories/need-help.repository";

type NeedHelpState = {
  volunteers: Volunteer[];
  start: Date;
  end: Date;
  search: string;
  teams: Team[];
};

function defaultPeriod() {
  const currentDate = new Date();

  const nextQuarterStep = Math.ceil(currentDate.getTime() / QUARTER_IN_MS);
  const nextQuarterInMs = nextQuarterStep * QUARTER_IN_MS;
  const endPeriodInMs = nextQuarterInMs + ONE_HOUR_IN_MS;

  const start = new Date(nextQuarterInMs);
  const end = new Date(endPeriodInMs);

  return { start, end };
}

export const state = (): NeedHelpState => ({
  volunteers: [],
  start: defaultPeriod().start,
  end: defaultPeriod().end,
  search: "",
  teams: [],
});

export const getters = getterTree(state, {
  period(state): IProvidePeriod {
    return { start: state.start, end: state.end };
  },
  filteredVolunteers(state): Volunteer[] {
    return state.volunteers.filter(
      (volunteer) =>
        isMatchingName(state.search, volunteer) &&
        isMatchingTeam(state.teams, volunteer),
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
        NeedHelpRepository.getAvailableVolunteers(this, getters.period),
      );
      if (!res) return;
      const volunteers = res.data.map(castVolunteerWithDate);
      commit("SET_VOLUNTEERS", volunteers);
    },
    updatePeriod({ commit, dispatch }, { start, end }: IProvidePeriod) {
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
    resetToDefaultPeriod({ dispatch }) {
      const period = defaultPeriod();
      dispatch("updatePeriod", period);
    },
  },
);

function isMatchingName(nameSearch: string, { firstname, lastname }: UserName) {
  const slugSearch = SlugifyService.apply(nameSearch);
  const slugName = SlugifyService.apply(`${firstname}${lastname}`);
  return slugName.includes(slugSearch);
}

function isMatchingTeam(teamsSearch: Team[], { teams }: { teams: string[] }) {
  if (teamsSearch.length === 0) return true;

  const teamCodes = teamsSearch.map(({ code }) => code);
  return teams.some((team) => teamCodes.includes(team));
}

function castVolunteerWithDate(
  volunteer: HttpStringified<Volunteer>,
): Volunteer {
  return {
    ...volunteer,
    availabilities: volunteer.availabilities.map(castPeriod),
    tasks: castVolunteerTaskWithDate(volunteer.tasks),
  };
}
