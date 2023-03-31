<template>
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
    <template #event="{ event }">
      <div
        class="pa-1 event underline-on-hover"
        @click="openFt(event.ft.id)"
        @mouseup.middle="openFtNewTab(event.ft.id)"
      >
        {{ `[${event.ft.id}] ${event.ft.name}` }}
      </div>
    </template>
  </OverCalendarV2>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";
import OverChips from "~/components/atoms/OverChips.vue";
import { getColorByStatus } from "~/domain/common/status-color";
import { isPeriodIncludedByAnother } from "~/utils/availabilities/availabilities";
import { formatUsername } from "~/utils/user/userUtils";

export default defineComponent({
  name: "Calendar",
  components: {
    OverChips,
    OverCalendarV2,
  },
  data: function () {
    return {
      calendarCentralDate: new Date("2023-05-12 00:00+02:00"),
    };
  },
  computed: {
    availabilities() {
      return this.$accessor.volunteerAvailability.mAvailabilities;
    },
    ftRequests() {
      return this.$accessor.user.selectedUserFtRequests.map(
        ({ start, end, ft }) => ({
          start,
          end,
          ft,
          color: getColorByStatus(ft.status),
          timed: true,
        })
      );
    },
    events() {
      return this.ftRequests; // TODO: ajouter les créneaux affectés
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
    await Promise.all([
      this.$accessor.user.findUserById(userId),
      this.$accessor.user.getUserFtRequests(userId),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(userId),
    ]);
    document.title = formatUsername(this.user);
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
    openFt(ftId: number) {
      this.$router.push({
        path: `/ft/${ftId}`,
      });
    },
    openFtNewTab(ftId: number) {
      window.open(`/ft/${ftId}`);
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

.event {
  height: 100%;
}

.underline-on-hover:hover {
  text-decoration: underline;
}
</style>
