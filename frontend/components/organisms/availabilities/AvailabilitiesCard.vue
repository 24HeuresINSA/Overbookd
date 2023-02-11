<template>
  <AvailabilitiesPickCalendar />
</template>

<script lang="ts">
import Vue from "vue";
import AvailabilitiesPickCalendar from "~/components/molecules/timeframe/AvailabilitiesPickCalendar.vue";

export default Vue.extend({
  name: "AvailabilitiesCard",
  components: { AvailabilitiesPickCalendar },
});
</script>
