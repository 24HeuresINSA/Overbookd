<template>
  <v-card class="filterable-assignment-list">
    <v-card-text class="filterable-assignment-list__text">
      <TaskFilters
        :list-length="filteredAssignments.length"
        class="filters"
        @change:search="searchTaskName = $event"
        @change:required-teams="requiredTeams = $event"
        @change:in-charge-team="inChargeTeam = $event"
        @change:category="category = $event"
        @change:has-assigned-friends="hasAssignedFriends = $event"
      ></TaskFilters>
      <v-divider />
      <TaskAssignmentList
        v-if="shouldShowAssignmentList"
        :assignments="filteredAssignments"
        class="assignment-list"
      ></TaskAssignmentList>
      <div v-else class="error-message">
        <p v-if="!selectedVolunteer">Aucun bénévole séléctionné</p>
        <p v-else>
          Aucun créneau disponible pour {{ selectedVolunteer.firstname }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskFilters from "~/components/molecules/assignment/filter/TaskFilters.vue";
import TaskAssignmentList from "~/components/molecules/assignment/list/TaskAssignmentList.vue";
import {
  TaskPriorities,
  TaskPriority,
} from "~/utils/assignment/task-priority";
import { Team } from "~/utils/models/team.model";
import { AssignmentCandidate } from "~/domain/timespan-assignment/timeSpanAssignment";
import { Searchable } from "~/utils/search/search.utils";
import { SlugifyService } from "@overbookd/slugify";
import { DisplayableCategory } from "~/utils/assignment/task-category";
import { AssignmentSummaryWithTask } from "@overbookd/http";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";

type FilterableTaskAssignmentListData = {
  requiredTeams: Team[];
  inChargeTeam: Team | null;
  searchTaskName: string;
  category: DisplayableCategory | TaskPriority | null;
  hasAssignedFriends: boolean;
};

export default defineComponent({
  name: "FilterableTaskAssignmentList",
  components: { TaskFilters, TaskAssignmentList },
  data: (): FilterableTaskAssignmentListData => ({
    hasAssignedFriends: false,
    requiredTeams: [],
    inChargeTeam: null,
    searchTaskName: "",
    category: null,
  }),
  computed: {
    assignments(): AssignmentSummaryWithTask[] {
      return this.$accessor.assignVolunteerToTask.assignments;
    },
    searchableAssignments(): Searchable<AssignmentSummaryWithTask>[] {
      return this.assignments.map((assignment) => ({
        ...assignment,
        searchable: SlugifyService.apply(
          `${assignment.taskId} ${assignment.name}`,
        ),
      }));
    },
    filteredAssignments(): AssignmentSummaryWithTask[] {
      return this.searchableAssignments
        .filter((assignment) => this.isMatchingFilter(assignment))
        .map((assignment) => this.removeUnavailableTeamRequests(assignment));
    },
    selectedVolunteer(): VolunteerWithAssignmentDuration | null {
      return this.$accessor.assignVolunteerToTask.selectedVolunteer;
    },
    shouldShowAssignmentList(): boolean {
      return (
        this.selectedVolunteer !== null && this.filteredAssignments.length > 0
      );
    },
  },
  methods: {
    filterByRequestedTeams(
      teamsSearched: Team[],
    ): (assignment: AssignmentSummaryWithTask) => boolean {
      return teamsSearched.length > 0
        ? (assignment) =>
            teamsSearched.every((teamSearched) =>
              assignment.teams.some(({ team }) => teamSearched.code === team),
            )
        : () => true;
    },
    filterByInChargeTeam(
      teamSearched: Team | null,
    ): (assignment: AssignmentSummaryWithTask) => boolean {
      return (assignment) => {
        return !teamSearched?.code
          ? true
          : teamSearched?.code === assignment.inChargeTeam;
      };
    },
    filterByCatergoryOrPriority(
      categorySearched: DisplayableCategory | TaskPriority | null,
    ): (assignment: AssignmentSummaryWithTask) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterByCategory(categorySearched);
    },
    isTaskPriority(
      category: TaskPriority | DisplayableCategory,
    ): category is TaskPriority {
      return Object.values(TaskPriorities).includes(category);
    },
    filterByCategory(
      categorySearched: DisplayableCategory,
    ): (assignment: AssignmentSummaryWithTask) => boolean {
      return (ft) => ft.category === categorySearched;
    },
    filterByPriority(
      prioritySearched: TaskPriority,
    ): (assignment: AssignmentSummaryWithTask) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return ({ topPriority }) => topPriority === hasPriority;
    },
    filterByHasAssignedFriends(
      hasAssignedFriends: boolean,
    ): (assignment: AssignmentSummaryWithTask) => boolean {
      return ({ hasFriendsAssigned }) =>
        !hasAssignedFriends || hasFriendsAssigned;
    },
    isVolunteerAssignableTo(teamCode: string): boolean {
      if (!this.selectedVolunteer) return false;
      const candidate = new AssignmentCandidate(this.selectedVolunteer);
      return candidate.canBeAssignedAs(teamCode);
    },
    removeUnavailableTeamRequests(
      assignment: AssignmentSummaryWithTask,
    ): AssignmentSummaryWithTask {
      const teams = assignment.teams.filter(
        ({ team, assigned, demand }) =>
          this.isVolunteerAssignableTo(team) && demand > assigned,
      );
      return { ...assignment, teams };
    },
    isMatchingFilter(
      assignment: Searchable<AssignmentSummaryWithTask>,
    ): boolean {
      return (
        this.hasAssignableSlotsAvailable(assignment) &&
        this.filterByRequestedTeams(this.requiredTeams)(assignment) &&
        this.filterByInChargeTeam(this.inChargeTeam)(assignment) &&
        this.filterByCatergoryOrPriority(this.category)(assignment) &&
        this.filterByHasAssignedFriends(this.hasAssignedFriends)(assignment) &&
        this.filterByTaskName(this.searchTaskName)(assignment)
      );
    },
    hasAssignableSlotsAvailable(
      assignment: AssignmentSummaryWithTask,
    ): boolean {
      return assignment.teams.some(({ team, demand, assigned }) => {
        if (!this.selectedVolunteer) return false;
        const candidate = new AssignmentCandidate(this.selectedVolunteer);
        return demand > assigned && candidate.canBeAssignedAs(team);
      });
    },
    filterByTaskName(
      search: string,
    ): (assignment: Searchable<AssignmentSummaryWithTask>) => boolean {
      const slugifiedSearch = SlugifyService.apply(search);
      return ({ searchable }) => searchable.includes(slugifiedSearch);
    },
  },
});
</script>

<style lang="scss" scoped>
$filters-height: 275px;
$column-margins: 30px;
$layout-padding: 20px;

.filterable-assignment-list {
  min-height: 100%;
  display: flex;
  flex-direction: column;

  &__text {
    padding: 0;
  }
}

.filters {
  height: $filters-height;
}

.assignment-list {
  padding: 0 5px;
  height: calc(
    100vh - #{$filters-height} - #{$header-height} - #{$footer-height} - #{$layout-padding} -
      #{$column-margins}
  );
}

.error-message {
  align-items: center;
  justify-content: center;
  display: flex;
  height: calc(
    100vh - #{$filters-height} - #{$header-height} - #{$footer-height} - #{$layout-padding} -
      #{$column-margins}
  );
  margin: 0 5%;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
