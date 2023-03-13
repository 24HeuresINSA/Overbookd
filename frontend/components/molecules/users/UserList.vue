<template>
  <v-list-item-group>
    <v-list-item
      v-for="volunteer in volunteers"
      :key="volunteer.id"
      :value="volunteer.id"
      @click="selectVolunteer(volunteer)"
    >
      <VolunteerResume :volunteer="volunteer" />
    </v-list-item>
  </v-list-item-group>
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
