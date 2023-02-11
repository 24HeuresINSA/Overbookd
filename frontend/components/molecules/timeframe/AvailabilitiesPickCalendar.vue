<template>
  <v-calendar
    ref="formCalendar"
    type="week"
    :short-weekdays="false"
    :event-ripple="false"
    :weekdays="[1, 2, 3, 4, 5, 6, 0]"
    class="elevation-2"
  ></v-calendar>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "AvailabilitiesPickCalendar",
});
</script>
