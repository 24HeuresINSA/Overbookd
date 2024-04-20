<template>
  <v-virtual-scroll :items="tasks" item-height="64" class="virtual-scroll">
    <template #default="{ item }">
      <v-list-item
        :key="item.id"
        :value="item"
        class="list"
        @click="selectFt(item)"
      >
        <TaskResume
          :task="item"
          :class="{ 'is-selected': isSelected(item.id) }"
          class="list__task"
        ></TaskResume>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts">
import Vue from "vue";
import TaskResume from "../resume/TaskResume.vue";
import { MissingAssignmentTask } from "@overbookd/assignment";

export default Vue.extend({
  name: "TaskList",
  components: { TaskResume },
  props: {
    tasks: {
      type: Array as () => MissingAssignmentTask[],
      required: true,
    },
  },
  methods: {
    selectFt(ft: MissingAssignmentTask) {
      this.$accessor.assignTaskToVolunteer.selectTask(ft.id);
      //this.$accessor.assignment.fetchTimeSpansWithStats(ft.id);
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
