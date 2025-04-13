import {
  ONE_HOUR_IN_MS,
  Period,
  QUARTER_IN_MS,
  type IProvidePeriod,
} from "@overbookd/time";
import { SlugifyService } from "@overbookd/slugify";
import type { UserName } from "@overbookd/user";
import type { HelpingVolunteer, HttpStringified } from "@overbookd/http";
import type { Team } from "@overbookd/team";
import {
  castPeriodWithDate,
  castPeriodsWithDate,
} from "~/utils/http/cast-date/period.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import { isHttpError } from "~/utils/http/http-error.utils";
import { NeedHelpRepository } from "~/repositories/need-help.repository";

type State = {
  volunteers: HelpingVolunteer[];
  start: Date;
  end: Date;
  search: string;
  teams: Team[];
};

export const useNeedHelpStore = defineStore("need-help", {
  state: (): State => ({
    volunteers: [],
    start: defaultPeriod().start,
    end: defaultPeriod().end,
    search: "",
    teams: [],
  }),
  getters: {
    period(state): Period {
      return Period.init({ start: state.start, end: state.end });
    },
    filteredVolunteers(state): HelpingVolunteer[] {
      return state.volunteers.filter(
        (volunteer) =>
          isMatchingName(state.search, volunteer) &&
          isMatchingTeam(state.teams, volunteer),
      );
    },
  },
  actions: {
    async fetchVolunteers() {
      const res = await NeedHelpRepository.getAvailableVolunteers(this.period);
      if (isHttpError(res)) return;
      this.volunteers = res.map(castVolunteerWithDate);
    },
    updatePeriod({ start, end }: IProvidePeriod) {
      this.start = start;
      this.end = end;
    },
    updateSearch(search: string | null) {
      this.search = search ?? "";
    },
    updateTeams(teams: Team[]) {
      this.teams = teams;
    },
    resetToDefaultPeriod() {
      const { start, end } = defaultPeriod();
      this.start = start;
      this.end = end;
    },
  },
});

function defaultPeriod() {
  const currentDate = new Date();

  const nextQuarterStep = Math.ceil(currentDate.getTime() / QUARTER_IN_MS);
  const nextQuarterInMs = nextQuarterStep * QUARTER_IN_MS;
  const endPeriodInMs = nextQuarterInMs + ONE_HOUR_IN_MS;

  const start = new Date(nextQuarterInMs);
  const end = new Date(endPeriodInMs);

  return { start, end };
}

function isMatchingName(nameSearch: string, volunteer: UserName) {
  const slugSearch = SlugifyService.apply(nameSearch);
  const { searchable } = toSearchable(volunteer);
  return searchable.includes(slugSearch);
}

function isMatchingTeam(teamsSearch: Team[], { teams }: { teams: string[] }) {
  if (teamsSearch.length === 0) return true;
  const teamCodes = teamsSearch.map(({ code }) => code);
  return teams.some((team) => teamCodes.includes(team));
}

function castVolunteerWithDate(
  volunteer: HttpStringified<HelpingVolunteer>,
): HelpingVolunteer {
  return {
    ...volunteer,
    availabilities: castPeriodsWithDate(volunteer.availabilities),
    assignments: volunteer.assignments.map((assignment) => ({
      ...assignment,
      ...castPeriodWithDate(assignment),
    })),
  };
}
