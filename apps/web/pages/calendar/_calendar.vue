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
          v-for="team in user?.team"
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
import OverCalendar from "~/components/molecules/calendar/OverCalendar.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { StatusColor, getColorByStatus } from "~/domain/common/status-color";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { computeNextHourDate } from "~/utils/date/dateUtils";

import {
  CompleteUserWithPermissions,
  Task,
  VolunteerAssignmentStat,
  VolunteerTask,
} from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";
import AssignmentUserStats from "~/components/molecules/user/AssignmentUserStats.vue";

interface CalendarEventWithFt {
  start: Date;
  end: Date;
  ft: Task;
  color: StatusColor;
  timed: boolean;
}

export default Vue.extend({
  name: "Calendar",
  components: { OverCalendar, TeamChip, AssignmentUserStats },
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
        })
      );
    },
    user(): CompleteUserWithPermissions {
      return this.$accessor.user.selectedUser;
    },
    shouldShowStats(): boolean {
      return this.$accessor.user.hasPermission("can-affect");
    },
    manifDate(): Date {
      const startDate = this.$accessor.configuration.get("eventDate")?.start;
      if (!startDate) return new Date();
      return new Date(startDate);
    },
  },
  async created() {
    const userId = +this.$route.params.calendar;
    if (!this.$accessor.user.hasPermission("hard") || isNaN(userId)) {
      await this.$router.push({
        path: "/",
      });
    }
    await Promise.all([
      this.$accessor.user.findUserById(userId),
      this.$accessor.user.getUserFtRequests(userId),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(userId),
      this.$accessor.user.getVolunteerAssignments(userId),
    ]);
    if (this.shouldShowStats) {
      await this.$accessor.user.getVolunteerAssignmentStats(userId);
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
        isPeriodIncludedByAnother({ start, end })
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
