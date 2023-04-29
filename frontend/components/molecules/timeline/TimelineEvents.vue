<template>
  <div class="timeline-events">
    <div v-for="event in events" :key="event.fa.id" class="timeline-event">
      <h2>{{ event.fa.name }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { TimelineEvent } from "~/utils/models/timeline";

export default Vue.extend({
  name: "TimelineEvents",
  computed: {
    events(): TimelineEvent[] {
      return this.$accessor.timeline.events;
    },
  },
  created() {
    this.$accessor.timeline.fetchEvents();
  },
});
</script>

<style lang="scss" scoped>
.timeline-events {
  min-width: 100%;
  padding: 5px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  .timeline-event {
    min-width: 100%;
    min-height: 100px;
    border-radius: 10px;
    background-color: $timeline-fa-content-background-color;

    h2 {
      text-align: center;
      min-width: 100%;
      background-color: $timeline-fa-title-background-color;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
  }
}
</style>
