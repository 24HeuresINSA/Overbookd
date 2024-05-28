<template>
  <v-card class="filterable-volunteer-list">
    <v-card-text class="filterable-volunteer-list__text">
      <VolunteerFilters
        :list-length="displayedVolunteers.length"
        class="filters"
        @change:search="searchVolunteer = $event"
        @change:teams="teams = $event"
        @change:excluded-teams="excludedTeams = $event"
        @change:sort="sort = $event"
        @change:friend-filter="friendFilter = $event"
      ></VolunteerFilters>
      <v-divider />
      <AssignmentVolunteerList
        v-if="shouldShowVolunteerList"
        :volunteers="displayedVolunteers"
        class="volunteer-list"
        :class="isOrgaTaskMode ? 'volunteer-list--with-friend-list' : ''"
        @select-volunteer="selectVolunteer"
      ></AssignmentVolunteerList>
      <div v-else class="error-message">
        <p v-if="!selectedAssignment">Aucun créneau séléctionné</p>
        <p v-else>Aucun bénévole disponible pour ce créneau</p>
      </div>
      <FriendsDisplay
        v-if="isOrgaTaskMode"
        class="friend-list"
        @select-volunteer="selectVolunteer"
      ></FriendsDisplay>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AssignmentVolunteerList from "~/components/molecules/assignment/list/AssignmentVolunteerList.vue";
import FriendsDisplay from "~/components/molecules/friend/FriendsDisplay.vue";
import VolunteerFilters from "~/components/molecules/assignment/filter/VolunteerFilters.vue";
import { Team } from "@overbookd/http";
import { Sort } from "~/utils/models/assignment.model";
import {
  keepMatchingSearchCriteria,
  Searchable,
} from "~/utils/search/search.utils";
import {
  AssignmentVolunteer,
  isAssignableVolunteer,
} from "~/utils/assignment/assignment-volunteer";
import { isOrgaTaskMode } from "~/utils/assignment/mode";
import {
  AMIS_DEJA_AFFECTES,
  AMIS_DISPONIBLES,
  AUCUN_AMI,
  FriendFilter,
} from "~/utils/assignment/assignment.utils";
import { toSearchable } from "~/utils/search/search-user";
import { excludeMembersOf, keepMembersOf } from "~/utils/search/search-team";

type FilterableVolunteerListData = {
  teams: Team[];
  excludedTeams: Team[];
  searchVolunteer: string;
  sort: number;
  friendFilter: FriendFilter | undefined;
};

export default defineComponent({
  name: "FilterableVolunteerList",
  components: { AssignmentVolunteerList, FriendsDisplay, VolunteerFilters },
  emits: ["select-volunteer"],
  data: (): FilterableVolunteerListData => ({
    teams: [],
    excludedTeams: [],
    searchVolunteer: "",
    sort: 0,
    friendFilter: undefined,
  }),
  computed: {
    volunteers(): AssignmentVolunteer[] {
      if (this.isOrgaTaskMode) {
        return this.$accessor.assignVolunteerToTask.volunteers;
      }
      return this.$accessor.assignTaskToVolunteer.assignableVolunteers;
    },
    searchableVolunteers(): Searchable<AssignmentVolunteer>[] {
      return this.volunteers.map(toSearchable);
    },
    displayedVolunteers(): AssignmentVolunteer[] {
      const isPartOfIncludedTeams = keepMembersOf(this.teams);
      const isNotPartOfExcludedTeams = excludeMembersOf(this.excludedTeams);
      const hasSimilarName = keepMatchingSearchCriteria(this.searchVolunteer);
      const isMatchingFriendCondition = this.filterVolunteerByFriendCondition(
        this.friendFilter,
      );
      const filteredVolunteers = this.searchableVolunteers.filter(
        (volunteer) => {
          return (
            isPartOfIncludedTeams(volunteer) &&
            isNotPartOfExcludedTeams(volunteer) &&
            hasSimilarName(volunteer) &&
            isMatchingFriendCondition(volunteer)
          );
        },
      );
      return this.sortVolunteers(filteredVolunteers);
    },
    isOrgaTaskMode(): boolean {
      return isOrgaTaskMode(this.$route.path);
    },
    selectedAssignment() {
      return this.$accessor.assignTaskToVolunteer.selectedAssignment;
    },
    shouldShowVolunteerList(): boolean {
      const hasSelectedAssignment = this.selectedAssignment !== null;
      const hasDisplayedVolunteers = this.displayedVolunteers.length > 0;

      return (
        this.isOrgaTaskMode || (hasSelectedAssignment && hasDisplayedVolunteers)
      );
    },
  },
  methods: {
    selectVolunteer(volunteer: AssignmentVolunteer) {
      this.$emit("select-volunteer", volunteer);
    },
    sortVolunteers(volunteers: AssignmentVolunteer[]) {
      return volunteers.sort((a, b) => {
        const charismaDifference = a.charisma - b.charisma;
        if (this.sort === Sort.NONE) return charismaDifference;
        const durationDifference = a.assignmentDuration - b.assignmentDuration;
        const order = this.sort === Sort.DESC ? -1 : 1;
        return durationDifference === 0
          ? charismaDifference
          : durationDifference * order;
      });
    },
    filterVolunteerByFriendCondition(
      friendFilter: FriendFilter | undefined,
    ): (volunteer: AssignmentVolunteer) => boolean {
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
    },
  },
});
</script>

<style lang="scss" scoped>
$filters-height: 255px;
$friends-height: 160px;
$layout-padding: 20px;
$column-margins: 30px;

.filterable-volunteer-list {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  &__text {
    padding: 0;
  }
}

.volunteer-list {
  padding: 0 5px;
  height: calc(
    100vh - #{$filters-height} - #{$header-height} - #{$footer-height} - #{$layout-padding} -
      #{$column-margins}
  );
  &--with-friend-list {
    max-height: calc(
      100vh - #{$filters-height} - #{$header-height} - #{$friends-height} - #{$layout-padding} -
        #{$column-margins}
    );
  }
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: calc(
    100vh - #{$filters-height} - #{$header-height} - #{$footer-height} - #{$layout-padding}
  );
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
