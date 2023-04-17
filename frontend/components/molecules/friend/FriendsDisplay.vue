<template>
  <v-card class="friends-card">
    <v-card-title class="friends-card__title">{{ title }}</v-card-title>
    <v-card-text class="friends-card__list">
      <v-list-item-group>
        <v-list-item
          v-for="friend in selectedVolunteerFriends"
          :key="friend.id"
          class="friend-item"
          :value="friend.id"
          @click="selectVolunteer(friend)"
          @contextmenu.prevent="openCalendar(friend.id)"
        >
          {{ formatUsername(friend) }}
        </v-list-item>
        <v-list-item
          v-if="selectedVolunteerFriends.length === 0"
          class="friend-item"
        >
          Aucun ami 😢
        </v-list-item>
      </v-list-item-group>
    </v-card-text>
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
    selectedVolunteer(): Volunteer | null {
      return this.$accessor.assignment.selectedVolunteer;
    },
    selectedVolunteerFriends(): User[] {
      return this.$accessor.assignment.selectedVolunteerFriends;
    },
    title(): string {
      return `Amis de ${this.selectedVolunteer?.firstname} :`;
    },
  },
  methods: {
    selectVolunteer(friend: User) {
      const volunteer = this.$accessor.assignment.volunteers.find(
        (volunteer) => volunteer.id === friend.id
      );
      if (!volunteer) return;
      this.$emit("select-volunteer", volunteer);
    },
    formatUsername(user: User): string {
      return formatUsername(user);
    },
    openCalendar(id: number) {
      window.open(`/calendar/${id}`, "_blank");
    },
  },
});
</script>

<style lang="scss" scoped>
.friends-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid;

  &__title {
    padding: 8px 16px 4px 16px;
  }

  &__list {
    overflow-y: scroll;

    .friend-item {
      min-height: 36px;
    }
  }
}
</style>
