import { stringifyArrayQueryParam, stringifyQueryParam } from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";
import { EXCLUDED_TEAMS_QUERY_PARAM, FRIEND_QUERY_PARAM, INCLUDED_TEAMS_QUERY_PARAM, SEARCH_VOLUNTEER_QUERY_PARAM } from "./assignment-filters.constant";
import type { Team } from "@overbookd/team";
import { isFriendFilterKey, type FriendFilterKey } from "./friend-filter.utils";

export type AssignmentVolunteersFilters = {
  searchVolunteer?: string;
  includedTeams?: Team[];
  excludedTeams?: Team[];
  friend?: FriendFilterKey;
};

export class AssignmentVolunteersFilterBuilder {
  static getFromRouteQuery(query: LocationQuery): AssignmentVolunteersFilters {
    const search = this.extractQueryParamsValue(query, SEARCH_VOLUNTEER_QUERY_PARAM);
    const includedTeam = this.extractQueryParamsValue(query, INCLUDED_TEAMS_QUERY_PARAM);
    const excludedTeam = this.extractQueryParamsValue(query, EXCLUDED_TEAMS_QUERY_PARAM);
    const friend = this.extractQueryParamsValue(query, FRIEND_QUERY_PARAM);

    return {
      ...search,
      ...includedTeam,
      ...excludedTeam,
      ...friend,
    };
  }

  private static extractQueryParamsValue(
    params: LocationQuery,
    key: keyof AssignmentVolunteersFilters,
  ): AssignmentVolunteersFilters {
    switch (key) {
      case SEARCH_VOLUNTEER_QUERY_PARAM: {
        const searchString = stringifyQueryParam(params.searchVolunteer);
        const searchVolunteer = searchString ? searchString : undefined;
        return searchVolunteer ? { searchVolunteer } : {};
      }
      case INCLUDED_TEAMS_QUERY_PARAM: {
        const includedTeamsString = stringifyArrayQueryParam(params.includedTeams);
        const teamStore = useTeamStore();
        const includedTeams = includedTeamsString.map((teamCode: string) => teamStore.getTeamByCode(teamCode)).filter((team): team is Team => !!team);
        return includedTeams.length > 0 ? { includedTeams } : {};
      }
      case EXCLUDED_TEAMS_QUERY_PARAM: {
        const excludedTeamsString = stringifyArrayQueryParam(params.excludedTeams);
        const teamStore = useTeamStore();
        const excludedTeams = excludedTeamsString.map((teamCode: string) => teamStore.getTeamByCode(teamCode)).filter((team): team is Team => !!team);
        return excludedTeams.length > 0 ? { excludedTeams } : {};
      }
      case FRIEND_QUERY_PARAM: {
        const friend = stringifyQueryParam(params.friend) as string | undefined;
        if (!friend || !isFriendFilterKey(friend)) return {};
        return friend ? { friend } : {};
      }
      default:
        return {};
    }
  }
}

