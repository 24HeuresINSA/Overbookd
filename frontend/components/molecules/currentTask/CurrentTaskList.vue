<template>
  <div>
    <CurrentTaskCard />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CurrentTaskCard from "./CurrentTaskCard.vue";

export default Vue.extend({
  name: "CurrentTaskList",
  components: { CurrentTaskCard },
});
</script>
