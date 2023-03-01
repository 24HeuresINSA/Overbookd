<template>
  <div>
    <!-- TODO - Check why we can't switch the week -->
    <OverCalendarV2
      title="true"
      :date="new Date('2023-05-12 00:00+02:00')"
      class="no-scroll elevation-2"
    >
      <template #title>
        <h1>{{ user?.firstname }} {{ user?.lastname }}</h1>
        <div class="ml-2">
          <OverChips :roles="user?.team"></OverChips>
        </div>
      </template>
      <template #event="{ event }">
        <!-- TODO - Add FT call -->
        <div class="text-wrap">
          <h3>[{{ event.count }}]{{ event.name }}</h3>
        </div>
      </template>
      <template #interval="{ date, time }">
        <div v-if="isUserAvailableInTimeframe(date, time)" class="available" />
      </template>
    </OverCalendarV2>
  </div>
</template>

<script>
import OverChips from "~/components/atoms/overChips";
import OverCalendarV2 from "~/components/atoms/OverCalendarV2.vue";

export default {
  name: "Calendar",
  components: {
    OverChips,
    OverCalendarV2,
  },
  data: function () {
    return {
      userId: this.$route.params.calendar,
      user: undefined,
    };
  },
  async created() {
    if (!this.$accessor.user.hasPermission("hard")) {
      await this.$router.push({
        path: "/",
      });
    }
    await Promise.all([
      this.$accessor.user.findUserById(this.userId),
      this.$accessor.volunteerAvailability.fetchVolunteerAvailabilities(
        this.userId
      ),
    ]);
    this.user = this.$accessor.user.mUser;
  },
  methods: {
    getFormattedDate(date) {
      const month = ("0" + (date.getMonth() + 1)).slice(-2);
      const day = ("0" + date.getDate()).slice(-2);
      const year = date.getFullYear();
      const hour = ("0" + date.getHours()).slice(-2);
      const min = ("0" + date.getMinutes()).slice(-2);
      const seg = ("0" + date.getSeconds()).slice(-2);
      return (
        year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + seg
      );
    },
    getColor(type) {
      switch (type) {
        case "refused":
          return "red";
        case "submitted":
          return "orange";
        case "draft":
          return "grey";
        case "validated":
          return "success";
        case "affected":
          return "deep-purple";
        default:
          return "grey";
      }
    },
    isUserAvailableInTimeframe(date, time) {
      const timeframe = new Date(date + " " + time);
      const availabilities =
        this.$accessor.volunteerAvailability.availabilityRegistery
          .availabilities;
      const isUserAvailableInTimeframe = availabilities.some((availability) => {
        const start = new Date(availability.start);
        const end = new Date(availability.end);
        return (
          start.getTime() <= timeframe.getTime() + 5000 &&
          end.getTime() >= timeframe.getTime() + 5000
        );
      });
      return isUserAvailableInTimeframe;
    },
  },
};
</script>

<style scoped>
.available {
  background-color: rgba(95, 219, 72, 0.45);
  height: 100%;
  width: 100%;
}
</style>
