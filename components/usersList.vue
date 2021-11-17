<template>
  <div>
    <!-- list of  filtered users -->
    <v-list style="overflow-y: auto; height: auto" dense>
      <v-list-item-group v-model="selectedUserIndex">
        <v-list-item v-for="user of users" :key="user._id">
          <v-list-item-content>
            <v-list-item-title>
              {{ user.firstname }} {{ user.lastname.toUpperCase() }}
              {{ user.nickname ? `(${user.nickname})` : "" }}
              {{ user.charisma }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <OverChips :roles="user.team"></OverChips>
              <v-progress-linear
                :value="getAssignmentRatio(user)"
              ></v-progress-linear>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-tooltip top @click="selectedUser = user">
              <template #activator="{ on, attrs }">
                <v-icon dark v-bind="attrs" v-on="on"> mdi-information</v-icon>
              </template>
              <span>{{ user.comment }}</span>
            </v-tooltip>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script>
import { getConfig } from "../common/role";
import OverChips from "~/components/atoms/overChips";

export default {
  name: "UsersList",
  components: { OverChips },
  props: ["users"],

  data() {
    return {
      filters: {
        username: undefined,
        teams: [],
      },

      selectedUserIndex: undefined,

      timeframes: this.getConfig("timeframes"),
      teams: this.getConfig("teams"),
    };
  },

  watch: {
    selectedUserIndex() {
      const selectedUser = this.users[this.selectedUserIndex];
      this.$emit("selected-user", selectedUser);
    },
  },

  methods: {
    getConfig(key) {
      return this.$accessor.config.getConfig(key);
    },
    /**
     * compute the assignment ratio of a user
     */
    getAssignmentRatio({ assignments, availabilities }) {
      if (!assignments || !availabilities) {
        return 0;
      }
      return assignments.length / availabilities.length; // TODO change this
    },
  },
};
</script>

<style scoped></style>
