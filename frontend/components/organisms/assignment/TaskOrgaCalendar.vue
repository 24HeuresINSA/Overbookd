<template>
  <OverCalendarV2
    v-model="calendarMarker"
    :title="ftName"
    :events="ftTimespans()"
  >
    <template #event="{ event }">
      <div class="event underline-on-hover">
        {{ event.name }}
      </div>
    </template>
  </OverCalendarV2>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { FtWithTeamRequests } from "~/utils/models/ftTimespan";

export default Vue.extend({
  name: "TaskOrgaCalendar",
  components: { OverCalendarV2 },
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedFt(): FtWithTeamRequests | null {
      return this.$accessor.assignment.selectedFt;
    },
    ftName(): string {
      if (this.selectedFt === null) {
        return "";
      }
      return `[${this.selectedFt.id}] ${this.selectedFt.name}`;
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  methods: {
    ftTimespans() {
      if (this.selectedFt === null) {
        return [];
      }
      return [];
    },
  },
});
</script>

<style lang="scss" scoped>
.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
}
</style>
