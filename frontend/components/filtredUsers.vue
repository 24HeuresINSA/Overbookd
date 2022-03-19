<template>
  <div>
    <!-- list of  filtered users -->
    <v-card>
      <v-card-text>
        <h3>Filtres</h3>
        <div style="display: flex">
          <v-text-field
            prepend-icon="mdi-card-search"
            label="Recherche"
            @input="updateFilter('search', $event)"
          ></v-text-field>
          <v-combobox
            chips
            multiple
            dense
            clearable
            label="Team"
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

        <v-text-field
          v-model="filters.name"
          prepend-icon="mdi-card-search"
          label="Recherche d'orga"
        ></v-text-field>
        <v-combobox
          v-model="filters.teams"
          chips
          multiple
          clearable
          label="team"
          :items="getConfig('teams').map((e) => e.name)"
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
              <a style="color: white">{{ getRoleMetadata(item).name }}</a>
            </v-chip>
          </template>
        </v-combobox>
        <v-divider></v-divider>

        <UsersList :users="filteredUsers"></UsersList>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import UsersList from "./usersList";
import { getConfig } from "../common/role";

export default {
  name: "FilteredUsers",
  components: { UsersList },

  data() {
    return {
      timeframes: this.getConfig("timeframes"),
      teams: this.getConfig("teams"),
    };
  },

  computed: {
    filteredUsers() {
      return this.$accessor.assignment.filteredUsers;
    },
  },

  watch: {
    // filters: {
    //   deep: true,
    //
    //   handler() {
    //     const filters = this.filters;
    //     let users = this.users;
    //
    //     // filter by name
    //     if (filters.name) {
    //       const options = {
    //         // Search in `author` and in `tags` array
    //         keys: ["firstname", "lastname", "nickname"],
    //       };
    //       const fuse = new Fuse(users, options);
    //
    //       users = fuse.search(filters.name).map((e) => e.item);
    //     }
    //
    //     // filter by team
    //     if (filters.teams.length !== 0) {
    //       users = users.filter((user) => {
    //         if (user.team && user.team.length !== 0) {
    //           let all = true;
    //           filters.teams.forEach((t) => {
    //             all = all && user.team.includes(t);
    //           });
    //           return all;
    //         }
    //         return false;
    //       });
    //     }
    //     this.filteredUsers = users;
    //     this.sortFilteredUsers();
    //   },
    // },
  },

  async mounted() {},

  methods: {
    updateFilter(key, $event) {
      this.$accessor.assignment.setUserFilter({
        key,
        value: $event,
      });
    },
    sortFilteredUsers() {
      this.filteredUsers = this.filteredUsers.sort((user1, user2) => {
        user1.charisma = user1.charisma ? user1.charisma : 0;
        user2.charisma = user2.charisma ? user2.charisma : 0;

        if (user1.charisma > user2.charisma) {
          return -1;
        }
        if (user1.charisma < user2.charisma) {
          return 1;
        }
        return 0;
      });
    },

    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },

    getConfig(key) {
      return getConfig(this, key);
    },

    onSelectedUser(user) {
      this.$emit("selected-user", user);
    },
  },
};
</script>

<style scoped></style>
