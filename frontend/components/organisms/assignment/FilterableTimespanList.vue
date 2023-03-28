<template>
  <v-card class="filterable-timespan-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="filteredTimespans.length"
        class="filters"
        type="timespan"
        @change:search="timespan = $event"
        @change:teams="teams = $event"
      ></AssignmentFilters>
      <v-divider />
      <TaskList v-if="shouldShowTimespanList" class="timespan-list" />
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
import Vue from "vue";
import AssignmentFilters from "~/components/molecules/assignment/AssignmentFilters.vue";
import TaskList from "~/components/molecules/assignment/TaskList.vue";
import { Volunteer } from "~/utils/models/assignment";
import { TimespanWithFt } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "FilterableTimespanList",
  components: { AssignmentFilters, TaskList },
  data: () => ({
    teams: [],
    timespan: "",
  }),
  computed: {
    filteredTimespans(): TimespanWithFt[] {
      return this.$accessor.assignment.timespans;
    },
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
    shouldShowTimespanList(): boolean {
      return (
        this.selectedVolunteer !== null && this.filteredTimespans.length > 0
      );
    },
  },
});
</script>

<style lang="scss" scoped>
$filters-height: 140px;
$header-footer-height: 122px;

.filterable-timespan-list {
  width: 100%;
  max-height: 100vh;
  display: flex;
  flex-direction: column;
  .v-card__text {
    height: fit-content;
  }
}

.filters {
  width: 100%;
  height: $filters-height;
}

.timespan-list,
.error-message {
  width: 100%;
  height: calc(100vh - #{$filters-height + $header-footer-height});
  display: flex;
  flex-direction: column;
}

.error-message {
  align-items: center;
  justify-content: center;

  p {
    text-align: center;
    font-size: 1.8rem;
    line-height: 1.2;
    opacity: 0.6;
  }
}
</style>
