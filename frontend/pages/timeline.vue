<template>
  <div>
    <h1>Timeline</h1>
    <TasksTimeline />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TasksTimeline from "~/components/organisms/timeline/TasksTimeline.vue";

export default Vue.extend({
  name: "Timeline",
  components: { TasksTimeline },
});
</script>
