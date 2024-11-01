<template>
  <v-virtual-scroll :items="volunteers" item-height="80" class="virtual-scroll">
    <template #default="{ item }">
      <v-list-item
        :key="item.id"
        :value="item"
        class="list"
        @click="selectVolunteer(item)"
      >
        <AssignmentVolunteerResume
          :volunteer="item"
          :class="{ 'is-selected': isSelected(item.id) }"
          class="list__volunteer"
        />
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts" setup>
import type { AssignmentVolunteer } from "~/utils/assignment/assignment-volunteer";

const assignTaskToVolunteerStore = useAssignTaskToVolunteerStore();

defineProps({
  volunteers: {
    type: Array as PropType<AssignmentVolunteer[]>,
    required: true,
  },
});

const isSelected = (id: number): boolean => {
  return assignTaskToVolunteerStore.selectedVolunteer?.id === id;
};

const emit = defineEmits(["select-volunteer"]);
const selectVolunteer = (volunteer: AssignmentVolunteer): void => {
  if (!volunteer) return;
  emit("select-volunteer", volunteer);
};
</script>

<style lang="scss" scoped>
.virtual-scroll {
  height: 100%;
  margin-top: 4px;
}

.list {
  padding: 0;
  &__volunteer {
    padding: 0 16px;
  }
}

.is-selected {
  background: $list-selected-item-background-color;
}
</style>
