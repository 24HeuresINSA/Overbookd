<template>
  <v-virtual-scroll
    :items="volunteers"
    :item-height="shouldShowStat ? '75' : '60'"
    class="virtual-scroll"
  >
    <template #default="{ item }">
      <v-list-item
        :key="item.id"
        :value="item.id"
        @click="selectVolunteer(item)"
      >
        <VolunteerResume :volunteer="item" />
      </v-list-item>
    </template>
  </v-virtual-scroll>
</template>

<script lang="ts">
import Vue from "vue";
import VolunteerResume from "~/components/molecules/assignment/VolunteerResume.vue";
import { Volunteer } from "~/utils/models/assignment";
import { FtWithTimespan } from "~/utils/models/ftTimespan";

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
    selectedFt(): FtWithTimespan | null {
      return this.$accessor.assignment.selectedFt;
    },
    shouldShowStat(): boolean {
      return Boolean(this.selectedFt !== null && this.selectedFt.category);
    },
  },
  methods: {
    selectVolunteer(volunteer: Volunteer) {
      this.$accessor.assignment.setSelectedVolunteer(volunteer);
      this.$accessor.assignment.fetchSelectedVolunteerFriends(volunteer.id);
    },
  },
});
</script>

<style lang="scss" scoped>
.virtual-scroll {
  height: 100%;
}
</style>
