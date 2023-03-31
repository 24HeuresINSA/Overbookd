<template>
  <v-container class="assignment-container">
    <FilterableVolunteerList class="volunteer-list" />
    <FilterableFtList class="task-list" />
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import FilterableVolunteerList from "~/components/organisms/assignment/FilterableVolunteerList.vue";
import { FtWithTimespan } from "~/utils/models/ftTimespan";
import FilterableFtList from "~/components/organisms/assignment/FilterableFtList.vue";

export default Vue.extend({
  name: "TaskOrga",
  components: {
    FilterableVolunteerList,
    FilterableFtList,
  },
  computed: {
    ftWithTimespans(): FtWithTimespan[] {
      return this.$accessor.assignment.fts;
    },
  },
  async mounted() {
    this.$accessor.assignment.clearSelectedVariables();
    await this.$accessor.assignment.fetchFtsWithTimespans();
  },
});
</script>

<style lang="scss" scoped>
$header-footer-height: 100px;

.assignment-container {
  padding: 0;
  left: 0;
  top: 0;
  max-width: none;
  margin-left: 0;
  margin-right: 0;
  position: absolute;
  display: flex;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.volunteer-list {
  max-width: 350px;
  height: calc(100vh - #{$header-footer-height});
}

.task-list {
  max-width: 450px;
  height: calc(100vh - #{$header-footer-height});
}
</style>
