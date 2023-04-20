<template>
  <v-virtual-scroll :items="fts" item-height="64" class="virtual-scroll">
    <template #default="{ item }">
      <v-list-item
        :key="item.id"
        :value="item"
        class="list"
        @click="selectFt(item)"
      >
        <TaskResume
          :ft="item"
          :class="{ 'is-selected': isSelected(item.id) }"
          class="list__task"
        ></TaskResume>
      </v-list-item>
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
    isSelected(id: number): boolean {
      return this.$accessor.assignment.selectedFt?.id === id;
    },
  },
});
</script>

<style lang="scss" scoped>
.virtual-scroll {
  height: 100%;
  margin-top: 4px;
}

.list {
  padding: 0;
  &__task {
    padding: 0 16px;
  }
}

.is-selected {
  background: $list-selected-item-background-color;
}
</style>
