<template>
  <div class="content">
    <div v-if="isModeOrgaToTache">
      <h2>{{ "Amis de " + getSelectedUserName + " :" }}</h2>
      <v-virtual-scroll
        :items="selectedUserFriends"
        :height="height"
        item-height="30"
      >
        <template #default="{ item }">
          <v-list-item
            :value="item"
            class="clickable"
            @click="switchUser(item)"
          >
            {{ item.username }}
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </div>
    <div v-else>
      <h2>Amis</h2>
      <p style="font-style: italic">
        Les amis ne sont disponible qu'en mode orga-tâche
      </p>
    </div>
  </div>
</template>

<script>
import { Snack } from "~/utils/models/snack";

export default {
  data() {
    return {
      snack: new Snack(),
    };
  },

  computed: {
    selectedUserFriends() {
      const user = this.$accessor.assignment.selectedUser;
      if (user && user.friends) {
        let uniqueFriends = [];
        /* enlever les amis qui ont le même nom */
        user.friends.forEach((friend) => {
          if (
            uniqueFriends.findIndex((u) => u.username === friend.username) ===
            -1
          ) {
            uniqueFriends.push(friend);
          }
        });
        return uniqueFriends;
      } else {
        return [];
      }
    },
    height() {
      return window.innerHeight * 0.15;
    },
    getSelectedUserName() {
      const user = this.$accessor.assignment.selectedUser;
      if (user && user.firstname) {
        return user.firstname;
      } else {
        return "";
      }
    },
    isModeOrgaToTache() {
      return this.$accessor.assignment.filters.isModeOrgaToTache;
    },
  },
  methods: {
    switchUser({ id }) {
      if (!this.isModeOrgaToTache) {
        return;
      }
      this.$accessor.assignment.setSelectedUserBasedOnId(id);
      const selectedUser = this.$accessor.assignment.selectedUser;
      this.$accessor.assignment.getAvailableTimespansForUser(selectedUser);
      this.$accessor.assignment
        .getUserAssignedTimespans(selectedUser)
        .then(() => {
          this.snack.display("Planning chargé ✅");
        });
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  h2,
  p {
    margin: 0.5vh;
  }
  border: 1px solid #e0e0e0;
}
</style>
