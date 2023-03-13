<template>
  <v-card v-if="selectedVolunteerFriends.length > 0" class="friend-list">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-content>
      <v-list-item-group>
        <v-list-item
          v-for="friend in selectedVolunteerFriends"
          :key="friend.id"
          :value="friend.id"
          @click="selectVolunteer(friend)"
        >
          {{ formatUsername(friend) }}
        </v-list-item>
      </v-list-item-group>
    </v-card-content>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Volunteer } from "~/utils/models/assignment";
import { User } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "FriendsDisplay",
  computed: {
    selectedVolunteer(): Volunteer {
      return this.$accessor.assignment.selectedVolunteer;
    },
    selectedVolunteerFriends(): User[] {
      return this.$accessor.assignment.selectedVolunteerFriends;
    },
    title(): string {
      return `Amis de ${this.selectedVolunteer.firstname} :`;
    },
  },
  methods: {
    selectVolunteer(friend: User) {
      const volunteer = this.$accessor.assignment.volunteers.find(
        (volunteer) => volunteer.id === friend.id
      );
      if (!volunteer) return;
      this.$accessor.assignment.setSelectedVolunteer(volunteer);
      this.$accessor.assignment.fetchSelectedVolunteerFriends(volunteer.id);
    },
    formatUsername(user: User): string {
      return formatUsername(user);
    },
  },
});
</script>
