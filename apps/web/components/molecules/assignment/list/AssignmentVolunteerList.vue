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
        ></AssignmentVolunteerResume>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts">
import { AssignableVolunteer } from "@overbookd/assignment";
import Vue from "vue";
import AssignmentVolunteerResume from "~/components/molecules/assignment/resume/AssignmentVolunteerResume.vue";

export default Vue.extend({
  name: "AssignmentVolunteerList",
  components: { AssignmentVolunteerResume },
  props: {
    volunteers: {
      type: Array as () => AssignableVolunteer[],
      required: true,
      default: () => [],
    },
  },
  methods: {
    isSelected(id: number): boolean {
      return this.$accessor.assignVolunteerToTask.selectedVolunteer?.id === id;
    },
    selectVolunteer(volunteer: AssignableVolunteer): void {
      if (!volunteer) return;
      this.$emit("select-volunteer", volunteer);
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
  &__volunteer {
    padding: 0 16px;
  }
}

.is-selected {
  background: $list-selected-item-background-color;
}
</style>
