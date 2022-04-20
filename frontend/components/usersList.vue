<template>
  <div>
    <!-- list of  filtered users -->
    <v-virtual-scroll :items="users" :height="height" item-height="60">
      <template #default="{ item }">
        <v-list-item-group v-model="selectedUserIndex">
          <v-list-item
            :key="item._id"
            :value="item._id"
            @click="selectedUserIndex = item._id"
          >
            <UserResume :user="item"></UserResume>
          </v-list-item>
        </v-list-item-group>
      </template>
    </v-virtual-scroll>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      <h3>{{ snack.feedbackMessage }}</h3>
    </v-snackbar>
  </div>
</template>

<script>
import UserResume from "~/components/organisms/UserResume";
import { Snack } from "~/utils/models/snack";

export default {
  name: "UsersList",
  components: { UserResume },
  props: {
    users: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      filters: {
        username: undefined,
        teams: [],
      },

      height: window.innerHeight * 0.6,
      snack: new Snack(),
    };
  },

  computed: {
    selectedUserIndex: {
      get() {
        return this.$accessor.assignment.selectedUserIndex;
      },
      set(value) {
        this.$accessor.assignment.setUserIndex(value);
      },
    },
  },

  watch: {
    selectedUserIndex() {
      const isModeOrgaToTache =
        this.$accessor.assignment.filters.isModeOrgaToTache;
      const selectedUser = this.users.find(
        (user) => user._id === this.selectedUserIndex
      );
      const multipleSolidTask = this.$accessor.assignment.multipleSolidTask;
      if (isModeOrgaToTache) {
        this.$accessor.assignment.setSelectedUser(selectedUser);
        this.$accessor.assignment.getAvailableTimespansForUser(selectedUser);
        this.$accessor.assignment.getUserAssignedTimespans(selectedUser);
      } else {
        if (selectedUser && multipleSolidTask.length > 0) {
          const ft = this.$accessor.assignment.FTs.find(
            (ft) => ft.count === this.$accessor.assignment.selectedTimeSpan.FTID
          );
          this.$accessor.assignment.setSelectedUser(selectedUser);
          const res = this.$accessor.assignment.assignUserToTimespan({
            timespanID: selectedUser._id,
            userID: this.$accessor.assignment.selectedTimeSpan._id,
          });
          if (res) {
            this.snack.display("L'utilisateur a été assigné à la tâche");
            this.$accessor.assignment.setMultipleSolidTask(ft);
          }
        }
      }
    },
  },
};
</script>

<style scoped></style>
