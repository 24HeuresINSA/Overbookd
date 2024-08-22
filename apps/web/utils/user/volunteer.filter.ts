import {
  stringifyQueryParam,
  stringifyArrayQueryParam,
} from "~/utils/http/url-params.utils";
import type { Team } from "@overbookd/team";
import type { LocationQuery } from "vue-router";

export type VolunteerFilters = {
  search?: string;
  teams?: Team[];
  excludedTeams?: Team[];
};

export class VolunteerFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): VolunteerFilters {
    const search = this.extractQueryParamsValue(query, "search");
    const teams = this.extractQueryParamsValue(query, "teams");
    const excludedTeams = this.extractQueryParamsValue(query, "excludedTeams");
    return { ...search, ...teams, ...excludedTeams };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof VolunteerFilters,
  ): VolunteerFilters {
    switch (key) {
      case "search": {
        const searchString = stringifyQueryParam(params.search);
        const search = searchString ? searchString : undefined;
        return search ? { search } : {};
      }
      case "teams": {
        const codes = stringifyArrayQueryParam(params.teams);
        const teams = this.toTeams(codes);
        return teams.length > 0 ? { teams } : {};
      }
      case "excludedTeams": {
        const codes = stringifyArrayQueryParam(params.excludedTeams);
        const excludedTeams = this.toTeams(codes);
        return excludedTeams.length > 0 ? { excludedTeams } : {};
      }
    }
  }

  private static toTeams(codes: string[]): Team[] {
    const teamStore = useTeamStore();
    return codes
      .map((code) => {
        const team = teamStore.getTeamByCode(code);
        return team ? { ...team } : undefined;
      })
      .filter((team) => team !== undefined);
  }
}
