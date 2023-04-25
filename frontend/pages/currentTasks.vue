<template>
  <div class="page-content">
    <CurrentTaskFilters />
    <CurrentTaskList />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CurrentTaskFilters from "~/components/molecules/currentTask/CurrentTaskFilters.vue";
import CurrentTaskList from "~/components/molecules/currentTask/CurrentTaskList.vue";

export default Vue.extend({
  name: "CurrentTasks",
  components: { CurrentTaskFilters, CurrentTaskList },
});
</script>

<style lang="scss" scoped>
.page-content {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
