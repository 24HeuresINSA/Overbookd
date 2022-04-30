<template>
  <div>
    <!-- list of  filtered users -->
    <v-virtual-scroll :items="list" :height="height" item-height="60">
      <template #default="{ item }">
        <v-list-item-group v-model="selectedUserIndex">
          <v-list-item
            :key="item._id"
            :value="item._id"
            @click="selectedUserIndex = item._id"
          >
            <UserResume
              :user="item"
              @assign-user="(friend) => (selectedUserIndex = friend)"
              @click:user-details="openUserDetails($event)"
            />
          </v-list-item>
        </v-list-item-group>
      </template>
    </v-virtual-scroll>
    <v-snackbar v-model="snack.active" :timeout="snack.timeout">
      <h3 :style="`background-color: ${color}`">{{ snack.feedbackMessage }}</h3>
    </v-snackbar>
    <UserInformation
      :user="selectedUserForDetails"
      :toggle="isUserDetailsDialogOpen"
      @update-toggle="(t) => (isUserDetailsDialogOpen = t)"
    />
  </div>
</template>

<script>
import UserResume from "~/components/organisms/UserResume";
import UserInformation from "./organisms/userInformation";
import { Snack } from "~/utils/models/snack";

export default {
  name: "UsersList",
  components: { UserResume, UserInformation },
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
      color: "transparent",
      selectedUserForDetails: {},
      isUserDetailsDialogOpen: false,
    };
  },

  computed: {
    list() {
      const isModeOrgaToTache =
        this.$accessor.assignment.filters.isModeOrgaToTache;
      if (!isModeOrgaToTache) {
        this.users.forEach((element) => {
          element.availableFriend = new Set();
          element.friends.forEach((friend) => {
            let findUser = this.users.filter((i) => i._id === friend.id);
            if (findUser.length > 0) {
              element.availableFriend.add(findUser[0]);
            }
          });
        });
      }
      return this.users;
    },
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
      this.color = "transparent";
      const isModeOrgaToTache =
        this.$accessor.assignment.filters.isModeOrgaToTache;
      const selectedUser = this.users.find(
        (user) => user._id === this.selectedUserIndex
      );
      const multipleSolidTask = this.$accessor.assignment.multipleSolidTask;
      if (isModeOrgaToTache) {
        this.$accessor.assignment.setSelectedUser(selectedUser);
        this.$accessor.assignment.getAvailableTimespansForUser(selectedUser);
        this.$accessor.assignment
          .getUserAssignedTimespans(selectedUser)
          .then(() => {
            this.snack.display("Planning chargé ✅");
          });
      } else {
        if (selectedUser && multipleSolidTask.length > 0) {
          const ft = this.$accessor.assignment.FTs.find(
            (ft) => ft.count === this.$accessor.assignment.selectedTimeSpan.FTID
          );
          this.$accessor.assignment.setSelectedUser(selectedUser);
          this.$accessor.assignment
            .assignUserToTimespan({
              timespanID: selectedUser._id,
              userID: this.$accessor.assignment.selectedTimeSpan._id,
            })
            .then((res) => {
              if (res) {
                this.snack.display("L'utilisateur a été assigné à la tâche");
                this.$accessor.assignment.setMultipleSolidTask(ft);
              } else {
                this.color = "red";
                this.snack.display("Une erreur est survenue");
              }
            });
        }
      }
    },
  },

  methods: {
    openUserDetails(user) {
      this.selectedUserForDetails = user;
      this.isUserDetailsDialogOpen = true;
    },
  },
};
</script>

<style scoped></style>
