<template>
  <div class="timeline">
    <TimelineForm />
    <TimelineChart />
    <TimelineEvents />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimelineChart from "~/components/molecules/timeline/TimelineChart.vue";
import TimelineEvents from "~/components/molecules/timeline/TimelineEvents.vue";
import TimelineForm from "~/components/molecules/timeline/TimelineForm.vue";

export default Vue.extend({
  name: "TasksTimeline",
  components: { TimelineChart, TimelineEvents, TimelineForm },
});
</script>
