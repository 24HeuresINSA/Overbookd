<template>
  <div>
    <!-- list of  filtered users -->
    <v-list-item-group v-model="selectedUserIndex">
      <v-virtual-scroll :items="users" :height="height" item-height="90">
        <template #default="{ item }">
          <v-list-item :key="item._id">
            <v-list-item-content>
              <v-list-item-title>
                {{ item.firstname }} {{ item.lastname.toUpperCase() }}
                {{ item.nickname ? `(${item.nickname})` : "" }}
                {{ item.charisma }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <OverChipsLight :roles="item.team"></OverChipsLight>
                <v-progress-linear
                  :value="getAssignmentRatio(item)"
                ></v-progress-linear>
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-tooltip top>
                <template #activator="{ on, attrs }">
                  <v-icon small v-bind="attrs" v-on="on">
                    mdi-information</v-icon
                  >
                </template>
                <span>{{ item.comment }}</span>
              </v-tooltip>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </v-list-item-group>
  </div>
</template>

<script>
import { getConfig } from "../common/role";
import OverChipsLight from "~/components/atoms/overChipsLight";

export default {
  name: "UsersList",
  components: { OverChipsLight },
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
      height: window.innerHeight * 0.75,
    };
  },

  watch: {
    selectedUserIndex() {
      const selectedUser = this.users[this.selectedUserIndex];
      this.$accessor.assignment.setSelectedUser(selectedUser);
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
