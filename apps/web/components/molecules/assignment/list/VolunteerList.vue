<template>
  <v-virtual-scroll :items="volunteers" item-height="80" class="virtual-scroll">
    <template #default="{ item }">
      <v-list-item
        :key="item.id"
        :value="item"
        class="list"
        @click="selectVolunteer(item)"
      >
        <VolunteerResume
          :volunteer="item"
          :class="{ 'is-selected': isSelected(item.id) }"
          class="list__volunteer"
        ></VolunteerResume>
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts">
import Vue from "vue";
import VolunteerResume from "~/components/molecules/assignment/resume/VolunteerResume.vue";
import { Volunteer } from "~/utils/models/assignment";

export default Vue.extend({
  name: "VolunteerList",
  components: { VolunteerResume },
  props: {
    volunteers: {
      type: Array as () => Volunteer[],
      required: true,
      default: () => [],
    },
  },
  methods: {
    isSelected(id: number): boolean {
      return this.$accessor.assignment.selectedVolunteer?.id === id;
    },
    selectVolunteer(volunteer: Volunteer): void {
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
