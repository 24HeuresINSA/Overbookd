<template>
  <v-virtual-scroll :items="users" item-height="60">
    <template #default="{ item }">
      <v-list-item-group v-model="selectedUserId">
        <v-list-item
          :key="item.id"
          :value="item.id"
          @click="selectedUserId = item"
        >
          {{ `${item.firstname} ${item.lastname}` }}
          <!--<UserResume
            :user="item"
            @assign-user="(friend) => (selectedUserIndex = friend)"
            @click:user-details="openUserDetails($event)"
          />-->
        </v-list-item>
      </v-list-item-group>
    </template>
  </v-virtual-scroll>
  <!--<v-snackbar v-model="snack.active" :timeout="snack.timeout">
    <h3 :style="`background-color: ${color}`">{{ snack.feedbackMessage }}</h3>
  </v-snackbar>
  <UserInformation
    :user="selectedUserForDetails"
    :toggle="isUserDetailsDialogOpen"
    @update-toggle="(t) => (isUserDetailsDialogOpen = t)"
  />-->
</template>

<script lang="ts">
import Vue from "vue";
import { User } from "~/utils/models/user";

export default Vue.extend({
  name: "UsersList",
  data: () => ({
    selectedUserId: -1,
  }),
  computed: {
    users(): User[] {
      return this.$accessor.user.users;
    },
  },
});
</script>
