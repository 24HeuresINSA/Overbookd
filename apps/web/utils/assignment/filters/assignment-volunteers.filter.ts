import {
  stringifyArrayQueryParam,
  stringifyQueryParam,
} from "~/utils/http/url-params.utils";
import type { LocationQuery } from "vue-router";
import {
  EXCLUDED_TEAMS_QUERY_PARAM,
  FRIEND_QUERY_PARAM,
  INCLUDED_TEAMS_QUERY_PARAM,
  SEARCH_VOLUNTEER_QUERY_PARAM,
} from "./assignment-filters.constant";
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
    const searchVolunteer = stringifyQueryParam(
      query[SEARCH_VOLUNTEER_QUERY_PARAM],
    );
    const includedTeams = this.getTeams(
      stringifyArrayQueryParam(query[INCLUDED_TEAMS_QUERY_PARAM]),
    );
    const excludedTeams = this.getTeams(
      stringifyArrayQueryParam(query[EXCLUDED_TEAMS_QUERY_PARAM]),
    );
    const friend = stringifyQueryParam(query[FRIEND_QUERY_PARAM]);

    return {
      ...(searchVolunteer ? { searchVolunteer } : {}),
      ...(includedTeams.length ? { includedTeams } : {}),
      ...(excludedTeams.length ? { excludedTeams } : {}),
      ...(isFriendFilterKey(friend) ? { friend } : {}),
    };
  }

  private static getTeams(teamCodes: string[]): Team[] {
    const teamStore = useTeamStore();
    return teamCodes
      .map((teamCode) => teamStore.getTeamByCode(teamCode))
      .filter((team): team is Team => !!team);
  }
}
