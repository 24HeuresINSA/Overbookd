<template>
  <div>
    <h1>Timeline</h1>
    <TimelineComponent />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import TimelineComponent from '~/components/organisms/timeline/Timeline.vue';

export default Vue.extend({
  name: 'Timeline',
  components: { TimelineComponent },
});
</script>
