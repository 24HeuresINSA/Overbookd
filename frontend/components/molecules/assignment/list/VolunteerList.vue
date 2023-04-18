<template>
  <v-virtual-scroll :items="volunteers" item-height="80" class="virtual-scroll">
    <template #default="{ item }">
      <v-list-item-group v-model="selectedVolunteerId">
        <v-list-item :key="item.id" :value="item">
          <VolunteerResume :volunteer="item" />
        </v-list-item>
      </v-list-item-group>
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
  computed: {
    selectedVolunteerId: {
      get(): number | null {
        return this.$accessor.assignment.selectedVolunteer?.id ?? null;
      },
      set(volunteer: Volunteer): void {
        this.$emit("select-volunteer", volunteer);
      },
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
