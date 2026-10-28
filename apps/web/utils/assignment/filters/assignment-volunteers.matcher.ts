import {
  type AssignmentVolunteer,
  isAssignableVolunteer,
} from "~/utils/assignment/assignment-volunteer";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import {
  excludeMembersOf,
  keepMembersOf,
} from "~/utils/search/search-team.utils";
import type { AssignmentVolunteersFilters } from "./assignment-volunteers.filter";
import {
  AMIS_DEJA_AFFECTES,
  AMIS_DISPONIBLES,
  AUCUN_AMI,
  type FriendFilterKey,
} from "./friend-filter.utils";

type VolunteerMatcher = (volunteer: Searchable<AssignmentVolunteer>) => boolean;

export function matchAssignmentVolunteersFilters(
  filters: AssignmentVolunteersFilters,
): VolunteerMatcher {
  const matchers: VolunteerMatcher[] = [
    keepMembersOf(filters.includedTeams ?? []),
    excludeMembersOf(filters.excludedTeams ?? []),
    keepMatchingSearchCriteria(filters.searchVolunteer ?? ""),
    matchFriendCondition(filters.friend),
  ];
  return (volunteer) => matchers.every((match) => match(volunteer));
}

function matchFriendCondition(
  friendFilter?: FriendFilterKey,
): VolunteerMatcher {
  switch (friendFilter) {
    case AUCUN_AMI.key:
      return (volunteer) => !volunteer.friendCount.volunteerCount;
    case AMIS_DISPONIBLES.key:
      return (volunteer) =>
        isAssignableVolunteer(volunteer) &&
        volunteer.assignableFriendsIds.length > 0;
    case AMIS_DEJA_AFFECTES.key:
      return (volunteer) =>
        isAssignableVolunteer(volunteer) && volunteer.hasFriendAssigned;
    default:
      return () => true;
  }
}
