<template>
  <div>
    <!-- list of  filtered users -->
    <v-card>
      <v-card-text>
        <div style="display: flex">
          <v-text-field
            label="Recherche"
            style="padding: 2px"
            @input="updateFilter('search', $event)"
          ></v-text-field>
          <v-combobox
            chips
            multiple
            dense
            clearable
            label="Team"
            style="padding: 2px"
            :items="getConfig('teams').map((e) => e.name)"
            @input="updateFilter('team', $event)"
          >
            <template #selection="{ attrs, item, selected }">
              <v-chip
                v-bind="attrs"
                :input-value="selected"
                :color="getRoleMetadata(item).color"
              >
                <v-icon left color="white">
                  {{ getRoleMetadata(item).icon }}
                </v-icon>
                <a style="color: white">
                  {{ getRoleMetadata(item).name }}
                </a>
              </v-chip>
            </template>
          </v-combobox>
          <v-btn-toggle
              @change="updateFilter('driverLicense', $event)"
              tile
              style="flex-direction: column"
              color="deep-purple accent-3"
              group
          >
            <v-btn x-small :value="true">Permis</v-btn>
            <v-btn x-small :value="false">Pas de permis</v-btn>
          </v-btn-toggle>
        </div>
        <v-divider></v-divider>
        <div class="content">
          <UsersList :users="filteredUsers" class="userList"></UsersList>
          <FriendsDisplay class="friendsDisplay" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UsersList from "./usersList";
import {getConfig} from "../common/role";
import FriendsDisplay from "./molecules/friendsDisplay.vue";

export default {
  name: "FilteredUsers",
  components: { UsersList, FriendsDisplay },

  data() {
    return {
      teams: this.getConfig("teams"),
    };
  },

  computed: {
    filteredUsers() {
      return this.$accessor.assignment.filteredUsers.filter(
        (user) => user.team.includes("hard") || user.team.includes("soft")
      );
    },
  },

  watch: {},

  async mounted() {},

  methods: {
    updateFilter(key, $event) {
      this.$accessor.assignment.setUserFilter({
        key,
        value: $event,
      });
    },

    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },

    getConfig(key) {
      return getConfig(this, key);
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  display: grid;
  .userList {
    grid-row: 1;
  }
  .friendsDisplay {
    grid-row: 2;
  }
}
</style>
