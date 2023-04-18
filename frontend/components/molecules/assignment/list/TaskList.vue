<template>
  <v-virtual-scroll :items="fts" item-height="64" class="virtual-scroll">
    <template #default="{ item }">
      <v-list-item-group v-model="selectedTaskId">
        <v-list-item :key="item.id" :value="item">
          <TaskResume :ft="item" />
        </v-list-item>
      </v-list-item-group>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts">
import Vue from "vue";
import {
  FtWithTimespan,
  getRequiredTeamsInFt,
} from "~/utils/models/ftTimespan";
import TaskResume from "../resume/TaskResume.vue";

export default Vue.extend({
  name: "TaskList",
  components: { TaskResume },
  props: {
    fts: {
      type: Array as () => FtWithTimespan[],
      required: true,
      default: () => [],
    },
  },
  computed: {
    selectedTaskId: {
      get(): number | null {
        return this.$accessor.assignment.selectedFt?.id ?? null;
      },
      set(ft: FtWithTimespan): void {
        this.selectFt(ft);
      },
    },
  },
  methods: {
    getRequiredTeams(ft: FtWithTimespan) {
      return getRequiredTeamsInFt(ft);
    },
    selectFt(ft: FtWithTimespan) {
      if (!ft) return;
      this.$accessor.assignment.setSelectedFt(ft);
      this.$accessor.assignment.setVolunteers([]);
      this.$accessor.assignment.fetchTimespansWithStats(ft.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.virtual-scroll {
  height: 100%;
  margin-top: 4px;
}
</style>
