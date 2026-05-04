<template>
  <v-card
    class="filterable-volunteer-list"
    :class="{ closed: isSideBarClosed }"
  >
    <v-btn
      icon="mdi-chevron-left"
      :aria-label="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la liste de bénévoles`"
      :title="`${isSideBarClosed ? 'Ouvrir' : 'Fermer'} la liste de bénévoles`"
      variant="flat"
      density="compact"
      class="btn-close-side-bar"
      :class="{ 'rotate-180': isSideBarClosed }"
      @click="toggleSideBar"
    />

    <v-card-text
      v-if="!isSideBarClosed"
      class="filterable-volunteer-list__text"
    >
      <AssignmentVolunteerFilters
        v-model:search="filters.searchVolunteer"
        v-model:included-teams="filters.includedTeams"
        v-model:excluded-teams="filters.excludedTeams"
        v-model:friend-filter="filters.friend"
        v-model:sort="sort"
        :list-length="displayedVolunteers.length"
        class="filters"
      />
      <v-divider />
      <AssignmentVolunteerList
        v-if="shouldShowVolunteerList"
        :volunteers="displayedVolunteers"
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
  type FriendFilterKey,
} from "~/utils/assignment/filters/friend-filter.utils";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import {
  excludeMembersOf,
  keepMembersOf,
} from "~/utils/search/search-team.utils";
import type { Assignment } from "@overbookd/assignment";
import type { AssignmentVolunteersFilters } from "~/utils/assignment/filters/assignment-volunteers.filter";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();
const assignVolunteerToTaskStore = useAssignVolunteerToTaskStore();
const route = useRoute();

const sort = ref<number>(Sort.NONE);
const filters = defineModel<AssignmentVolunteersFilters>("filters", { required: true });
const isOrgaTask = computed<boolean>(() => isOrgaTaskMode(route.path));

const isSideBarClosed = ref<boolean>(false);
const toggleSideBar = () => {
  isSideBarClosed.value = !isSideBarClosed.value;
};


const volunteers = computed<AssignmentVolunteer[]>(() =>
  isOrgaTask.value
    ? [...assignVolunteerToTaskStore.volunteers.values()]
    : assignTaskToVolunteerStore.assignableVolunteers,
);
const searchableVolunteers = computed<Searchable<AssignmentVolunteer>[]>(() =>
  volunteers.value.map(toSearchable),
);
const displayedVolunteers = computed<AssignmentVolunteer[]>(() => {
  const isPartOfIncludedTeams = keepMembersOf(filters.value.includedTeams || []);
  const isNotPartOfExcludedTeams = excludeMembersOf(filters.value.excludedTeams || []);
  const hasSimilarName = keepMatchingSearchCriteria(filters.value.searchVolunteer || "");
  const isMatchingFriendCondition = filterVolunteerByFriendCondition(
    filters.value.friend,
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
  friendFilter: FriendFilterKey | undefined,
): ((volunteer: AssignmentVolunteer) => boolean) => {
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
.filterable-volunteer-list {
  min-height: 100%;

  width: 420px;
  transition: width 0.3s ease;

  &.closed {
    width: 30px;
  }

  &__text {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0;
  }
}

.btn-close-side-bar {
  position: absolute;
  top: 16px;
  right: -3px;

  &.rotate-180 {
    right: 0;
  }
}

.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s ease;
}

.filters {
  flex-shrink: 0;
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: 100%;
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}

.friend-list {
  flex-shrink: 0;
}
</style>
