<template>
  <div class="timespan-list" @mouseleave="hoverTimespan(null)">
    <v-virtual-scroll
      :items="timespans"
      item-height="70"
      class="virtual-scroll"
    >
      <template #default="{ item }">
        <v-list-item :key="item.id" @mouseover="hoverTimespan(item)">
          <TimespanResume
            :timespan="item"
            @selected-team="(team) => assign(item.id, team)"
          ></TimespanResume>
        </v-list-item>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { formatDateWithMinutes } from "~/utils/date/dateUtils";
import { AvailableTimespan } from "~/utils/models/ftTimespan";
import TimespanResume from "../resume/TimespanResume.vue";
import { Volunteer } from "~/utils/models/assignment";

export default Vue.extend({
  name: "FtTimespanList",
  components: { TimespanResume },
  props: {
    timespans: {
      type: Array as () => AvailableTimespan[],
      required: true,
      default: () => [],
    },
  },
  computed: {
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
  },
  methods: {
    formatDate(date: Date) {
      return formatDateWithMinutes(date);
    },
    hoverTimespan(timespan: AvailableTimespan | null) {
      this.$accessor.assignment.setHoverTimespan(timespan);
    },
    assign(timespanId: number, teamCode: string) {
      if (!this.selectedVolunteer) return;
      const volunteerId = this.selectedVolunteer.id;
      this.$accessor.assignment.saveAssignment({
        timespanId,
        teamCode,
        volunteerId,
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.timespan-list {
  width: 100%;
  height: 100%;
  overflow: auto;
  &__item {
    cursor: pointer;
  }
}
</style>
