<template>
  <v-list-item-group>
    <v-list-item
      v-for="user in users"
      :key="user.id"
      :value="user.id"
      @click="selectUser(user)"
    >
      <UserResume :user="user" />
    </v-list-item>
  </v-list-item-group>
</template>

<script lang="ts">
import Vue from "vue";
import UserResume from "~/components/organisms/UserResume.vue";
import { CompleteUserWithPermissions } from "~/utils/models/user";

export default Vue.extend({
  name: "UserList",
  components: { UserResume },
  props: {
    users: {
      type: Array as () => CompleteUserWithPermissions[],
      required: true,
      default: () => [],
    },
  },
  data: () => ({
    selectedUserId: -1,
  }),
  methods: {
    selectUser(user: CompleteUserWithPermissions) {
      this.selectedUserId = user.id;
      this.$accessor.user.setSelectedUser(user);
      this.$accessor.user.fetchSelectedUserFriends(user.id);
    },
  },
});
</script>
