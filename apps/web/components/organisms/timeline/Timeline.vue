<template>
  <div class="timeline">
    <TimelineForm class="form" />
    <TimelineAxis />
    <TimelineEvents />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TimelineAxis from "~/components/molecules/timeline/TimelineAxis.vue";
import TimelineEvents from "~/components/molecules/timeline/TimelineEvents.vue";
import TimelineForm from "~/components/molecules/timeline/TimelineForm.vue";

export default Vue.extend({
  name: "TasksTimeline",
  components: { TimelineEvents, TimelineForm, TimelineAxis },
});
</script>

<style lang="scss" scoped>
.form {
  margin-bottom: 10px;
}
</style>
