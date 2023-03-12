<template>
  <div>
    <OverCalendarV2
      v-model="calendarCentralDate"
      :events="events"
      class="no-scroll elevation-2"
    >
      <template #title>
        <h1>{{ user?.firstname }} {{ user?.lastname }}</h1>
        <div class="ml-2">
          <OverChips :roles="user?.team"></OverChips>
        </div>
      </template>
      <template #interval="{ date, time }">
        <div :class="{ available: isUserAvailable(date, time) }" />
      </template>
    </OverCalendarV2>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PeriodWithFtId } from "~/utils/models/ft";
import OverChips from "~/components/atoms/OverChips.vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";

export default defineComponent({
  name: "Calendar",
  components: {
    OverChips,
    OverCalendarV2,
  },
  data: function () {
    return {
      ftUserRequests: [] as PeriodWithFtId[],
      calendarCentralDate: new Date("2023-05-12 00:00+02:00"),
    };
  },
  computed: {
    availabilities() {
      return this.$accessor.volunteerAvailability.mAvailabilities;
    },
    events() {
      return this.ftUserRequests.map((ftRequest) => ({
        start: new Date(ftRequest.start),
        end: new Date(ftRequest.end),
        name: `[${ftRequest.ftId}] ${ftRequest.ftName}`,
        color: "#ff0000",
        timed: true,
      }));
    },
    user() {
      return this.$accessor.user.selectedUser;
    },
  },
  async created() {
    const userId = +this.$route.params.calendar;
    if (!this.$accessor.user.hasPermission("hard") || isNaN(userId)) {
      await this.$router.push({
        path: "/",
      });
    }
    const res = await Promise.all([
      this.$accessor.user.getUserFtRequests(userId),
      this.$accessor.user.findUserById(userId),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(userId),
    ]);
    this.ftUserRequests = res[0];
  },
  methods: {
    updateDate(date: Date) {
      this.calendarCentralDate = date;
    },
    isUserAvailable(date: string, time: string) {
      const datetime = new Date(`${date} ${time}`);
      return this.availabilities.some(
        isPeriodIncludedByAnother({ start: datetime, end: datetime })
      );
    },
  },
});
</script>

<style scoped>
.available {
  background-color: rgba(95, 219, 72, 0.45);
  height: 100%;
  width: 100%;
}
</style>
