import {
  stringifyQueryParam,
  stringifyArrayQueryParam,
} from "~/utils/http/url-params.utils";
import type { Team } from "@overbookd/team";
import type { LocationQuery } from "vue-router";
import { OverDate } from "@overbookd/time";

export type NeedHelpFilters = {
  start?: Date;
  end?: Date;
  search?: string;
  teams?: Team[];
};

export class NeedHelpFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): NeedHelpFilters {
    const start = this.extractQueryParamsValue(query, "start");
    const end = this.extractQueryParamsValue(query, "end");
    const search = this.extractQueryParamsValue(query, "search");
    const teams = this.extractQueryParamsValue(query, "teams");
    return { ...start, ...end, ...search, ...teams };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof NeedHelpFilters,
  ): NeedHelpFilters {
    switch (key) {
      case "start": {
        const startString = stringifyQueryParam(params.start);
        if (!startString) return {};
        try {
          const localStartDate = new Date(startString);
          const start = OverDate.fromLocal(localStartDate).date;
          return { start };
        } catch {
          return {};
        }
      }
      case "end": {
        const endString = stringifyQueryParam(params.end);
        if (!endString) return {};
        try {
          const localEndDate = new Date(endString);
          const end = OverDate.fromLocal(localEndDate).date;
          return { end };
        } catch {
          return {};
        }
      }
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
