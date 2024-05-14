<template>
  <v-card class="filterable-task-list">
    <v-card-text class="filterable-task-list__text">
      <TaskFilters
        :list-length="filteredTasks.length"
        class="filters"
        type="ft"
        @change:search="searchTask = $event"
        @change:required-teams="requiredTeams = $event"
        @change:in-charge-team="inChargeTeam = $event"
        @change:category="category = $event"
        @change:completed="completed = $event"
      ></TaskFilters>
      <v-divider />
      <TaskList :tasks="filteredTasks" class="task-list" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TaskFilters from "~/components/molecules/assignment/filter/TaskFilters.vue";
import TaskList from "~/components/molecules/assignment/list/TaskList.vue";
import { TaskPriority, TaskPriorities } from "~/utils/assignment/task-priority";
import { Team } from "~/utils/models/team.model";
import { SlugifyService } from "@overbookd/slugify";
import { Searchable } from "~/utils/search/search.utils";
import { MissingAssignmentTask } from "@overbookd/assignment";
import { DisplayableCategory } from "~/utils/assignment/task-category";

type FilterableTaskListData = {
  requiredTeams: Team[];
  inChargeTeam: Team | null;
  searchTask: string;
  category: DisplayableCategory | TaskPriority | null;
  completed: boolean;
};

export default defineComponent({
  name: "FilterableTaskList",
  components: { TaskFilters, TaskList },
  data: (): FilterableTaskListData => ({
    completed: false,
    requiredTeams: [],
    inChargeTeam: null,
    searchTask: "",
    category: null,
  }),
  computed: {
    tasks(): MissingAssignmentTask[] {
      return this.$accessor.assignTaskToVolunteer.tasks;
    },
    searchableTasks(): Searchable<MissingAssignmentTask>[] {
      return this.tasks.map((task) => ({
        ...task,
        searchable: SlugifyService.apply(`${task.id} ${task.name}`),
      }));
    },
    filteredTasks(): MissingAssignmentTask[] {
      return this.searchableTasks.filter((task) => {
        return (
          this.filterByRequestedTeams(this.requiredTeams)(task) &&
          this.filterByInChargeTeam(this.inChargeTeam)(task) &&
          this.filterByCatergoryOrPriority(this.category)(task) &&
          this.filterByName(this.searchTask)(task)
        );
      });
    },
  },
  watch: {
    completed(completed: boolean) {
      this.$accessor.assignTaskToVolunteer.fetchTasks(completed);
    },
  },
  methods: {
    filterByRequestedTeams(
      teamsSearched: Team[],
    ): (task: MissingAssignmentTask) => boolean {
      return teamsSearched.length > 0
        ? (task) =>
            teamsSearched.every((teamSearched) =>
              task.teams.some((teamCode) => teamSearched.code === teamCode),
            )
        : () => true;
    },
    filterByInChargeTeam(
      teamSearched: Team | null,
    ): (task: MissingAssignmentTask) => boolean {
      return (task) => {
        return !teamSearched?.code
          ? true
          : teamSearched?.code === task.inChargeTeam;
      };
    },
    isTaskPriority(
      category: TaskPriority | DisplayableCategory,
    ): category is TaskPriority {
      return Object.values(TaskPriorities).includes(category);
    },
    filterByCatergoryOrPriority(
      categorySearched: DisplayableCategory | TaskPriority | null,
    ): (task: MissingAssignmentTask) => boolean {
      if (!categorySearched) return () => true;
      if (this.isTaskPriority(categorySearched)) {
        return this.filterByPriority(categorySearched);
      }
      return this.filterByCategory(categorySearched);
    },
    filterByCategory(
      categorySearched: DisplayableCategory,
    ): (task: MissingAssignmentTask) => boolean {
      return (task) => {
        if (categorySearched === "AUCUNE") return task.category === null;
        return task.category === categorySearched;
      };
    },
    filterByPriority(
      prioritySearched: TaskPriority,
    ): (task: MissingAssignmentTask) => boolean {
      const hasPriority = prioritySearched === TaskPriorities.PRIORITAIRE;
      return (task) => task.topPriority === hasPriority;
    },
    filterByName(
      search: string,
    ): (task: Searchable<MissingAssignmentTask>) => boolean {
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

.filterable-task-list {
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

.task-list {
  padding: 0 5px;
  height: calc(
    100vh - #{$filters-height} - #{$header-height} - #{$footer-height} - #{$layout-padding} -
      #{$column-margins}
  );
}
</style>
