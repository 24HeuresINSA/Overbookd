<template>
  <v-card class="filterable-volunteer-list">
    <v-card-text class="filterable-volunteer-list__text">
      <AssignmentVolunteerFilters
        v-model:search="searchVolunteer"
        v-model:teams="teams"
        v-model:excluded-teams="excludedTeams"
        v-model:sort="sort"
        v-model:friend-filter="friendFilter"
        :list-length="displayedVolunteers.length"
        class="filters"
      />
      <v-divider />
      <AssignmentVolunteerList
        v-if="shouldShowVolunteerList"
        :volunteers="displayedVolunteers"
        class="volunteer-list"
        :class="isOrgaTask ? 'volunteer-list--with-friend-list' : ''"
        @select-volunteer="selectVolunteer"
      />
      <div v-else class="error-message">
        <p v-if="!selectedAssignment">Aucun créneau séléctionné</p>
        <p v-else>Aucun bénévole disponible pour ce créneau</p>
      </div>
      <AssignmentVolunteerFriendsCard
        v-if="isOrgaTask"
        class="friend-list"
        @select-volunteer="selectVolunteer"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import { Sort } from "~/utils/sort/sort.utils";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import {
  type AssignmentVolunteer,
  isAssignableVolunteer,
} from "~/utils/assignment/assignment-volunteer";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import {
  AMIS_DEJA_AFFECTES,
  AMIS_DISPONIBLES,
  AUCUN_AMI,
  type FriendFilter,
} from "~/utils/assignment/assignment.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import {
  excludeMembersOf,
  keepMembersOf,
} from "~/utils/search/search-team.utils";
import type { Assignment } from "@overbookd/assignment";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const route = useRoute();

const teams = ref<Team[]>([]);
const excludedTeams = ref<Team[]>([]);
const searchVolunteer = ref<string>("");
const sort = ref<number>(Sort.NONE);
const friendFilter = ref<FriendFilter | undefined>();

const isOrgaTask = computed<boolean>(() => isOrgaTaskMode(route.path));

const volunteers = computed<AssignmentVolunteer[]>(() =>
  isOrgaTask.value
    ? assignVolunteerToTaskStore.volunteers
    : assignTaskToVolunteerStore.assignableVolunteers,
);
const searchableVolunteers = computed<Searchable<AssignmentVolunteer>[]>(() =>
  volunteers.value.map(toSearchable),
);
const displayedVolunteers = computed<AssignmentVolunteer[]>(() => {
  const isPartOfIncludedTeams = keepMembersOf(teams.value);
  const isNotPartOfExcludedTeams = excludeMembersOf(excludedTeams.value);
  const hasSimilarName = keepMatchingSearchCriteria(searchVolunteer.value);
  const isMatchingFriendCondition = filterVolunteerByFriendCondition(
    friendFilter.value,
  );
  const filteredVolunteers = searchableVolunteers.value.filter((volunteer) => {
    return (
      isPartOfIncludedTeams(volunteer) &&
      isNotPartOfExcludedTeams(volunteer) &&
      hasSimilarName(volunteer) &&
      isMatchingFriendCondition(volunteer)
    );
  });
  return sortVolunteers(filteredVolunteers);
});
const sortVolunteers = (volunteers: AssignmentVolunteer[]) => {
  return volunteers.sort((a, b) => {
    const charismaDifference = a.charisma - b.charisma;
    if (sort.value === Sort.NONE) return charismaDifference;
    const durationDifference = a.assignmentDuration - b.assignmentDuration;
    const order = sort.value === Sort.DESC ? -1 : 1;
    return durationDifference === 0
      ? charismaDifference
      : durationDifference * order;
  });
};
const filterVolunteerByFriendCondition = (
  friendFilter: FriendFilter | undefined,
): ((volunteer: AssignmentVolunteer) => boolean) => {
  switch (friendFilter) {
    case AUCUN_AMI:
      return (volunteer) => !volunteer.hasAtLeastOneFriend;
    case AMIS_DISPONIBLES:
      return (volunteer) =>
        isAssignableVolunteer(volunteer) &&
        volunteer.assignableFriendsIds.length > 0;
    case AMIS_DEJA_AFFECTES:
      return (volunteer) =>
        isAssignableVolunteer(volunteer) && volunteer.hasFriendAssigned;
    case undefined:
    default:
      return () => true;
  }
};

const emit = defineEmits(["select-volunteer"]);
const selectVolunteer = (volunteer: AssignmentVolunteer) => {
  emit("select-volunteer", volunteer);
};

const selectedAssignment = computed<Assignment | null>(
  () => assignTaskToVolunteerStore.selectedAssignment,
);
const shouldShowVolunteerList = computed<boolean>(() => {
  const hasSelectedAssignment = selectedAssignment.value !== null;
  const hasDisplayedVolunteers = displayedVolunteers.value.length > 0;
  return isOrgaTask.value || (hasSelectedAssignment && hasDisplayedVolunteers);
});
</script>

<style lang="scss" scoped>
@use "~/assets/assignment.scss" as *;

$filters-height: $volunteer-list-filters-height;
$friends-height: $volunteer-list-friends-card-height;
$page-content-padding: $desktop-content-vertical-padding * 2;
$card-paddings: $card-margin * 2;

.filterable-volunteer-list {
  min-height: 100%;
  display: flex;
  flex-direction: column;
  &__text {
    padding: 0;
  }
}

$base-list-height: calc(
  100vh - $header-height - $filters-height - $card-paddings -
    $page-content-padding
);
.volunteer-list {
  padding: 0 5px;
  height: $base-list-height;
  &--with-friend-list {
    max-height: calc($base-list-height - $friends-height);
  }
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: $base-list-height;
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}

.friend-list {
  margin-top: 5px;
  height: $friends-height;
}
</style>
