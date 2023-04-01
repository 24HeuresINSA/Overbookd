<template>
  <OverCalendarV2
    v-model="calendarMarker"
    :title="volunteerName"
    :events="assignedTimespans"
  >
    <template #interval="{ date, time }">
      <div :class="{ available: isVolunteerAvailable(date, time) }" />
    </template>
    <template #event="{ event }">
      <div
        class="event underline-on-hover"
        @mouseup.middle="openFtNewTab(event.timespan.ft.id)"
      >
        {{ `[${event.timespan.ft.id}] ${event.timespan.ft.name}` }}
      </div>
    </template>
  </OverCalendarV2>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { Volunteer } from "~/utils/models/assignment";
import { CalendarItem } from "~/utils/models/calendar";
import { TimespanWithFt } from "~/utils/models/ftTimespan";
import { formatUsername } from "~/utils/user/userUtils";

interface CalendarItemWithTimespan extends CalendarItem {
  timespan: TimespanWithFt;
}

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
    availabilities(): Availability[] {
      return this.$accessor.volunteerAvailability.mAvailabilities;
    },
    hoverTimespan(): TimespanWithFt | null {
      return this.$accessor.assignment.hoverTimespan;
    },
    assignedTimespans(): CalendarItemWithTimespan[] {
      // TODO: add assigned timespans
      const timespans = this.hoverTimespan ? [this.hoverTimespan] : [];
      return this.formatTimespanForCalendar(timespans);
    },
  },
  watch: {
    hoverTimespan() {
      this.calendarMarker = this.hoverTimespan?.start || this.manifDate;
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
    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`);
    },
    formatTimespanForCalendar(
      timespans: TimespanWithFt[]
    ): CalendarItemWithTimespan[] {
      return timespans.map((timespan) => ({
        start: timespan.start,
        end: timespan.end,
        name: timespan.ft.name,
        color: "#000000",
        timed: true,
        timespan,
      }));
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

.event {
  height: 100%;
  white-space: normal;
  padding: 2px;
  overflow: hidden;
}

.underline-on-hover:hover {
  text-decoration: underline;
}
</style>
