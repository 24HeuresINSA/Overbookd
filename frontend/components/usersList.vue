<template>
  <div>
    <!-- list of  filtered users -->
    <v-virtual-scroll :items="users" :height="height" item-height="60">
      <template #default="{ item }">
        <v-list-item-group v-model="selectedUserIndex">
          <v-list-item :key="item._id" :value="item._id">
            <UserResume :user="item"></UserResume>
          </v-list-item>
        </v-list-item-group>
      </template>
    </v-virtual-scroll>
  </div>
</template>

<script>
import UserResume from "~/components/organisms/UserResume";

export default {
  name: "UsersList",
  components: { UserResume },
  props: ["users"],

  data() {
    return {
      filters: {
        username: undefined,
        teams: [],
      },

      selectedUserIndex: undefined,

      height: window.innerHeight * 0.75,
    };
  },

  watch: {
    selectedUserIndex() {
      const selectedUser = this.users.find(
        (user) => user._id === this.selectedUserIndex
      );
      this.$accessor.assignment.setSelectedUser(selectedUser);
      //this.$accessor.assignment.getAvailableTimespansForUser(selectedUser);
    },
  },
};
</script>

<style scoped></style>
