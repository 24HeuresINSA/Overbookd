<template>
  <v-virtual-scroll :items="tasks" item-height="64" class="virtual-scroll">
    <template #default="{ item }">
      <v-list-item
        :key="item.id"
        :value="item"
        class="list"
        @click="selectTask(item)"
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
import { defineComponent } from "vue";
import TaskResume from "../resume/TaskResume.vue";
import { MissingAssignmentTask } from "@overbookd/assignment";

export default defineComponent({
  name: "TaskList",
  components: { TaskResume },
  props: {
    tasks: {
      type: Array as () => MissingAssignmentTask[],
      required: true,
    },
  },
  methods: {
    selectTask({ id }: MissingAssignmentTask) {
      this.$accessor.assignTaskToVolunteer.selectTask(id);
    },
    isSelected(id: number): boolean {
      return this.$accessor.assignTaskToVolunteer.selectedTask?.id === id;
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
