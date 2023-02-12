<template>
  <div>
    <v-calendar
      ref="refCalendar"
      type="week"
      :short-weekdays="false"
      :event-ripple="false"
      :weekdays="[1, 2, 3, 4, 5, 6, 0]"
      :start="start"
      :end="end"
      color="primary"
      class="elevation-1"
    ></v-calendar>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AvailabilitiesPickCalendar",
  props: {
    start: {
      type: String,
      default: "",
    },
    end: {
      type: String,
      default: "",
    },
  },
});
</script>
