<template>
  <OverCalendarV2 v-model="calendarMarker" :title="volunteerName">
    <template #interval="{ date, time }">
      <div :class="{ available: isVolunteerAvailable(date, time) }" />
    </template>
  </OverCalendarV2>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { Volunteer } from "~/utils/models/assignment";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "AssignmentCalendar",
  components: { OverCalendarV2 },
  data: () => ({
    calendarMarker: new Date(),
  }),
  computed: {
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
    volunteerName(): string {
      if (!this.selectedVolunteer) return "";
      return formatUsername(this.selectedVolunteer);
    },
    manifDate(): Date {
      return new Date(this.$accessor.config.getConfig("event_date"));
    },
    availabilities() {
      return this.$accessor.volunteerAvailability.mAvailabilities;
    },
  },
  mounted() {
    this.calendarMarker = this.manifDate;
  },
  methods: {
    isVolunteerAvailable(date: string, time: string) {
      const datetime = new Date(`${date} ${time}`);
      return this.availabilities.some(
        isPeriodIncludedByAnother({ start: datetime, end: datetime })
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.available {
  background-color: rgba(95, 219, 72, 0.45);
  height: 100%;
  width: 100%;
}
</style>
