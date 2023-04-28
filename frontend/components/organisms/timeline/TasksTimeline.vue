<template>
  <div>
    <TimelineChart />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimelineChart from "~/components/molecules/timeline/TimelineChart.vue";

export default Vue.extend({
  name: "TasksTimeline",
  components: { TimelineChart },
});
</script>
