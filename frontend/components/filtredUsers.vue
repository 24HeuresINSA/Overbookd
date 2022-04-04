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
        </div>

        <v-divider></v-divider>

        <UsersList :users="filteredUsers"></UsersList>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UsersList from "./usersList";

export default {
  name: "FilteredUsers",
  components: { UsersList },

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
      return this.$accessor.config.getConfig(key);
    },
  },
};
</script>

<style scoped></style>
