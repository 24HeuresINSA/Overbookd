<template>
  <v-card v-if="selectedUserFriends.length > 0" class="friend-list">
    <v-card-title>{{ title }}</v-card-title>
    <v-card-content>
      <v-list-item-group>
        <v-list-item
          v-for="friend in selectedUserFriends"
          :key="friend.id"
          :value="friend.id"
          @click="selectUser(friend)"
        >
          {{ formatUsername(friend) }}
        </v-list-item>
      </v-list-item-group>
    </v-card-content>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { CompleteUserWithPermissions, Friend } from "~/utils/models/user";
import { formatUsername } from "~/utils/user/userUtils";

export default Vue.extend({
  name: "FriendsDisplay",
  computed: {
    selectedUser(): CompleteUserWithPermissions {
      return this.$accessor.user.selectedUser;
    },
    selectedUserFriends(): Friend[] {
      return this.$accessor.user.selectedUserFriends;
    },
    title(): string {
      return `Amis de ${this.selectedUser.firstname} :`;
    },
  },
  methods: {
    selectUser(friend: Friend) {
      const user = this.$accessor.user.users.find(
        (user) => user.id === friend.id
      );
      if (!user) return;
      this.$accessor.user.setSelectedUser(user);
      this.$accessor.user.fetchSelectedUserFriends(user.id);
    },
    formatUsername(user: Friend): string {
      return formatUsername(user);
    },
  },
});
</script>
