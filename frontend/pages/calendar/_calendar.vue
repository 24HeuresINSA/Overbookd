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
      <div v-show="shouldShowStats" class="user-stats">
        <div v-for="stat in stats" :key="stat.category" class="stat">
          <v-tooltip top>
            <template #activator="{ on, attrs }">
              <p class="stat__duration" v-bind="attrs" v-on="on">
                {{ getDisplayedStat(stat) }}
              </p>
            </template>
            <span class="stat__category">{{
              getStatCategoryName(stat.category)
            }}</span>
          </v-tooltip>
        </div>
      </div>
    </template>
    <template #interval="{ date, time }">
      <div :class="{ available: isUserAvailable(date, time) }" />
    </template>
    <template #event="{ event }">
      <div
        class="event underline-on-hover"
        @click="openFt(event.ft.id)"
        @mouseup.middle="openFtNewTab(event.ft.id)"
      >
        {{ `[${event.ft.id}] ${event.ft.name}` }}
      </div>
    </template>
  </OverCalendar>
</template>

<script lang="ts">
import Vue from "vue";
import OverCalendar from "~/components/atoms/calendar/OverCalendar.vue";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { StatusColor, getColorByStatus } from "~/domain/common/status-color";
import { Availability } from "~/domain/volunteer-availability/volunteer-availability";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { computeNextHourDate } from "~/utils/date/dateUtils";
import { Duration } from "~/utils/date/duration";
import {
  TaskCategory,
  TaskCategoryEmojis,
  TaskCategoryEmojiMap,
} from "~/utils/models/ftTimespan";
import {
  CompleteUserWithPermissions,
  Task,
  VolunteerAssignmentStat,
  VolunteerTask,
} from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

interface CalendarEventWithFt {
  start: Date;
  end: Date;
  ft: Task;
  color: StatusColor;
  timed: boolean;
}

export default Vue.extend({
  name: "Calendar",
  components: { OverCalendar, TeamChip },
  data: function () {
    return {
      calendarCentralDate: new Date("2023-05-12 00:00+02:00"),
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
    document.title = formatUsername(this.user);
  },
  methods: {
    updateDate(date: Date) {
      this.calendarCentralDate = date;
    },
    getStatCategoryEmoji(category: TaskCategory | null): string {
      if (category === null) return TaskCategoryEmojis.AUCUNE;
      return TaskCategoryEmojiMap.get(category) ?? TaskCategoryEmojis.AUCUNE;
    },
    getStatCategoryName(category: TaskCategory | null): string {
      return category?.toLowerCase() ?? "indeterminé";
    },
    getDisplayedDuration(duration: number): string {
      return Duration.fromMilliseconds(duration).toString();
    },
    getDisplayedStat(stat: VolunteerAssignmentStat): string {
      const emoji = this.getStatCategoryEmoji(stat.category);
      const duration = this.getDisplayedDuration(stat.duration);
      return `${emoji} ${duration}`;
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
    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`);
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

.user-stats {
  margin-top: 4px;
  margin-left: 5px;
  display: flex;
}

.stat {
  display: flex;
  align-items: center;
  margin-right: 10px;

  &__category {
    text-transform: capitalize;
  }
  &__duration {
    font-size: 1.1rem;
    margin: 0;
  }
}
</style>
