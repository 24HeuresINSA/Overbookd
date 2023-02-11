<template>
  <div class="flex-row">
    <v-calendar
      ref="monthCalendar"
      type="month"
      :short-weekdays="false"
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      start="2023-05-08"
      end="2023-05-16"
      color="primary"
      class="elevation-2 month-calendar"
    ></v-calendar>
    <v-calendar
      ref="dailyCalendar"
      type="day"
      :short-weekdays="false"
      :event-ripple="false"
      value="2023-05-08"
      color="primary"
      class="elevation-2 daily-calendar"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AvailabilitiesPickCalendar",
});
</script>

<style lang="scss" scoped>
.flex-row {
  display: flex;

  .month-calendar {
    width: 75%;
    height: 700px;
    margin-right: 30px;
  }

  .daily-calendar {
    width: 25%;
    height: 700px;
  }
}
</style>
