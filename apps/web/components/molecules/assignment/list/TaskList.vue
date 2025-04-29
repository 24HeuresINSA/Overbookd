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
        />
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts" setup>
import type { TaskForAssignment } from "@overbookd/assignment";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

defineProps({
  tasks: {
    type: Array as PropType<TaskForAssignment[]>,
    required: true,
  },
});

const selectTask = (task: TaskForAssignment) => {
  assignTaskToVolunteerStore.selectTask(task.id);
};

const isSelected = (id: number): boolean => {
  return assignTaskToVolunteerStore.selectedTask?.id === id;
};
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
