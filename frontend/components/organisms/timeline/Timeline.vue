<template>
  <div class="timeline">
    <TimelineChart />
    <TimelineEvents />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimelineChart from "~/components/molecules/timeline/TimelineChart.vue";
import TimelineEvents from "~/components/molecules/timeline/TimelineEvents.vue";

export default Vue.extend({
  name: "TasksTimeline",
  components: { TimelineChart, TimelineEvents },
});
</script>
