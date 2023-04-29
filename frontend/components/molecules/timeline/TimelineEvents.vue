<template>
  <div class="timeline-events">
    <div v-for="event in events" :key="event.fa.id" class="timeline-event">
      <h2>{{ event.fa.name }}</h2>
      <div
        v-for="task in event.fts"
        :key="task.id"
        class="timeline-event__task"
      >
        <h3>{{ task.name }}</h3>
      </div>
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
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  .timeline-event {
    min-width: 100%;
    border-radius: 10px;
    background-color: $timeline-fa-content-background-color;
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-bottom: 5px;

    h2 {
      text-align: center;
      min-width: 100%;
      background-color: $timeline-fa-title-background-color;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }

    &__task {
      min-width: 100%;
      min-height: 100px;
      border-radius: 8px;
      background-color: $timeline-task-content-background-color;
      h3 {
        text-align: center;
        min-width: 100%;
        background-color: $timeline-task-title-background-color;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
    }
  }
}
</style>
