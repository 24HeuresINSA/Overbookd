<template>
  <v-card class="filterable-timespan-list">
    <v-card-text>
      <AssignmentFilters
        :list-length="0"
        class="filters"
        type="timespan"
        @change:search="timespan = $event"
        @change:teams="teams = $event"
      ></AssignmentFilters>
      <v-divider />
      <div class="timespan-list">
        <FtTimespanList v-if="filteredTimespans.length > 0" />
        <p v-else-if="!selectedVolunteer">Aucun bénévole séléctionné</p>
        <p v-else>Aucun créneau disponible</p>
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import AssignmentFilters from "~/components/molecules/assignment/AssignmentFilters.vue";
import FtTimespanList from "~/components/molecules/assignment/FtTimespanList.vue";
import { Volunteer } from "~/utils/models/assignment";
import { TimespanWithFt } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "FilterableTimespanList",
  components: { AssignmentFilters, FtTimespanList },
  data: () => ({
    teams: [],
    timespan: "",
  }),
  computed: {
    filteredTimespans(): TimespanWithFt[] {
      return [];
    },
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
  },
});
</script>

<style lang="scss" scoped>
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
  height: 140px;
}

.timespan-list {
  width: 100%;
  height: calc(100vh - 260px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  p {
    font-size: 1.5rem;
    opacity: 0.5;
  }
}
</style>
