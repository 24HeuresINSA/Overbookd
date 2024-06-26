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
          @contextmenu.prevent="openAssignmentPageInNewTab(friend.id)"
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
import { User } from "@overbookd/user";
import { formatUsername } from "~/utils/user/user.utils";
import { VolunteerWithAssignmentDuration } from "@overbookd/assignment";

export default Vue.extend({
  name: "FriendsDisplay",
  computed: {
    selectedVolunteer(): VolunteerWithAssignmentDuration | null {
      return this.$accessor.assignVolunteerToTask.selectedVolunteer;
    },
    selectedVolunteerFriends(): User[] {
      return this.$accessor.assignVolunteerToTask.selectedVolunteerFriends;
    },
    title(): string {
      const volunteerName = this.selectedVolunteer?.firstname ?? "...";
      return `Amis de ${volunteerName} :`;
    },
  },
  methods: {
    selectVolunteer(friend: User) {
      const volunteer = this.$accessor.assignVolunteerToTask.volunteers.find(
        (volunteer) => volunteer.id === friend.id,
      );
      if (!volunteer) return;
      this.$emit("select-volunteer", volunteer);
    },
    formatUsername(user: User): string {
      return formatUsername(user);
    },
    openAssignmentPageInNewTab(id: number) {
      window.open(`/assignment/orga-task?volunteer=${id}`, "_blank");
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
  height: 145px;

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
