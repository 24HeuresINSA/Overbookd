<template>
  <OverCalendar
    v-model="calendarCentralDate"
    :events="events"
    class="no-scroll elevation-2"
  >
    <template #title>
      <h1>{{ user?.firstname }} {{ user?.lastname }}</h1>
      <div class="ml-4">
        <TeamChip
          v-for="team in user?.teams"
          :key="team"
          :team="team"
          :with-name="true"
          class="mr-2"
        ></TeamChip>
      </div>
      <AssignmentUserStats
        v-show="shouldShowStats"
        :stats="stats"
        class="user-stats"
      ></AssignmentUserStats>
    </template>
    <template #interval="{ date, time }">
      <div :class="{ available: isUserAvailable(date, time) }" />
    </template>
    <template #event="{ event }">
      <div
        class="event underline-on-hover"
        @click="openFt(event.ft.id)"
        @mouseup.middle="openFtInNewTab(event.ft.id)"
      >
        {{ `[${event.ft.id}] ${event.ft.name}` }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import Vue from "vue";
import { Availability } from "@overbookd/volunteer-availability";
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { StatusColor, getColorByStatus } from "~/domain/common/status-color";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { computeNextHourDate } from "~/utils/date/date.utils";

import {
  Task,
  VolunteerAssignmentStat,
  VolunteerTask,
} from "~/utils/models/user.model";
import { formatUsername } from "~/utils/user/user.utils";
import AssignmentUserStats from "~/components/molecules/user/AssignmentUserStats.vue";
import { UserPersonnalData } from "@overbookd/user";

interface CalendarEventWithFt {
  start: Date;
  end: Date;
  ft: Task;
  color: StatusColor;
  timed: boolean;
}

export default Vue.extend({
  name: "UserCalendar",
  components: { OverCalendar, TeamChip, AssignmentUserStats },
  props: {
    userId: {
      type: Number,
      default: () => 0,
    },
  },
  data: function () {
    return {
      calendarCentralDate: new Date(),
    };
  },
  computed: {
    availabilities(): Availability[] {
      return this.$accessor.volunteerAvailability.mAvailabilities;
    },
    ftRequests(): VolunteerTask[] {
      return this.$accessor.user.selectedUserFtRequests;
    },
    assignments(): VolunteerTask[] {
      return this.$accessor.user.selectedUserAssignments;
    },
    stats(): VolunteerAssignmentStat[] {
      return this.$accessor.user.selectedUserAssignmentStats;
    },
    events(): CalendarEventWithFt[] {
      return [...this.ftRequests, ...this.assignments].map(
        ({ start, end, ft }) => ({
          start,
          end,
          ft,
          color: getColorByStatus(ft.status),
          timed: true,
        }),
      );
    },
    user(): UserPersonnalData {
      return this.$accessor.user.selectedUser;
    },
    shouldShowStats(): boolean {
      return this.$accessor.user.can("affect-volunteer");
    },
    manifDate(): Date {
      return this.$accessor.configuration.eventStartDate;
    },
  },
  async created() {
    await Promise.all([
      this.$accessor.user.findUserById(this.userId),
      this.$accessor.user.getUserFtRequests(this.userId),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.userId,
      ),
      this.$accessor.user.getVolunteerAssignments(this.userId),
    ]);

    if (this.shouldShowStats) {
      await this.$accessor.user.getVolunteerAssignmentStats(this.userId);
    }

    await this.$accessor.configuration.fetch("eventDate");
    this.calendarCentralDate = this.manifDate;
    document.title = formatUsername(this.user);
  },
  methods: {
    updateDate(date: Date) {
      this.calendarCentralDate = date;
    },
    isUserAvailable(date: string, time: string): boolean {
      const start = new Date(`${date} ${time}`);
      const end = computeNextHourDate(start);
      return this.availabilities.some(
        isPeriodIncludedByAnother({ start, end }),
      );
    },
    openFt(ftId: number) {
      this.$router.push({ path: `/ft/${ftId}` });
    },
    openFtInNewTab(ftId: number) {
      window.open(`/ft/${ftId}`);
    },
  },
});
</script>

<style lang="scss" scoped>
.available {
  background-color: $calendar-available-background-color;
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

.user-stats {
  margin-top: 3px;
  margin-left: 3px;
}
</style>
