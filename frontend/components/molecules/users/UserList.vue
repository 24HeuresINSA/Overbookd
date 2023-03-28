<template>
  <v-virtual-scroll :items="volunteers" height="600" item-height="60">
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
import VolunteerResume from "~/components/organisms/assignment/VolunteerResume.vue";
import { Volunteer } from "~/utils/models/assignment";

export default Vue.extend({
  name: "UserList",
  components: { VolunteerResume },
  props: {
    volunteers: {
      type: Array as () => Volunteer[],
      required: true,
      default: () => [],
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
