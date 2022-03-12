<template>
  <div>
    <h1>Modification des disponibilités pour chaque personne</h1>
    <template style="width: 100%; display: grid">
      <v-row>
        <v-col md="2">
          <v-card>
            <v-card-title>Filtres</v-card-title>
            <v-card-text style="display: flex; flex-direction: column">
              <v-text-field
                v-model="filters.search"
                label="Recherche"
              ></v-text-field>
              <v-combobox
                v-model="filters.teams"
                chips
                multiple
                clearable
                dense
                label="Team"
                :items="getConfig('teams').map((e) => e.name)"
              >
                <template #selection="{ attrs, item, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    :color="getRoleMetadata(item).color"
                  >
                    <v-icon left color="white">
                      {{ getRoleMetadata(item).icon }}
                    </v-icon>
                    <a style="color: white">{{ getRoleMetadata(item).name }}</a>
                  </v-chip>
                </template>
              </v-combobox>

              <template v-if="hasRole(['admin', 'bureau', 'humain'])">
                <label>Compte validé</label>
                <v-btn-toggle
                  v-model="filters.isValidated"
                  tile
                  color="deep-purple accent-3"
                  group
                >
                  <v-btn :value="true" small> oui</v-btn>

                  <v-btn :value="false" small> Non</v-btn>
                </v-btn-toggle>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="10">
          <v-data-table
            style="max-height: 100%; overflow-y: auto"
            :headers="headers"
            :items="filteredUsers"
            class="elevation-1"
            dense
            :items-per-page="20"
          >
            <template #[`item.team`]="{ item }">
              <v-container style="max-width: 150px">
                <OverChips :roles="item.team"></OverChips>
              </v-container>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </template>

    <v-snackbar v-model="isSnackbarOpen" :timeout="5000">
      {{ feedbackMessage }}

      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script>
import { getUser } from "../common/role";
import { isValidated } from "../utils/roles/index.ts";
import OverChips from "../components/atoms/overChips";
import Fuse from "fuse.js";
import SnackNotificationContainer from "../components/molecules/snackNotificationContainer";

export default {
  name: "Humans",
  components: {
    SnackNotificationContainer,
    OverChips,
  },
  data() {
    return {
      users: [],
      filteredUsers: [],
      headers: [
        { text: "prénom", value: "firstname" },
        { text: "nom", value: "lastname" },
        { text: "surnom", value: "nickname" },
        { text: "team", value: "team", cellClass: "width: 250px", width: "1" },
      ],

      teams: this.getConfig(this, "teams"),
      loading: false,

      filters: {
        search: undefined,
        hasDriverLicense: undefined,
        teams: [],
        isValidated: undefined,
        hasPayedContribution: undefined,
      },

      isTransactionDialogOpen: false,
      isUserDialogOpen: false,
      isSnackbarOpen: false,
      isCharismaDialogOpen: false,

      selectedUser: {
        nickname: undefined,
      },

      feedbackMessage: "sauvgardé 🥳",
    };
  },

  watch: {
    filters: {
      handler() {
        let mUsers = this.users;

        // filter by search
        if (this.filters.search) {
          const options = {
            // Search in `author` and in `tags` array
            keys: ["firstname", "lastname", "nickname", "phone"],
          };
          const fuse = new Fuse(mUsers, options);

          mUsers = fuse.search(this.filters.search).map((e) => e.item);
        }

        // filter by not validated
        if (this.filters.isValidated !== undefined) {
          if (this.filters.isValidated) {
            mUsers = mUsers.filter((user) => isValidated(user));
          } else {
            mUsers = mUsers.filter((user) => !isValidated(user));
          }
        }

        // filter by team
        if (this.filters.teams) {
          this.filteredUsers = mUsers.filter((user) => {
            if (user.team) {
              return (
                user.team.filter((value) => this.filters.teams.includes(value))
                  .length === this.filters.teams.length
              );
            } else {
              return false;
            }
          });
        }
      },
      deep: true,
    },

    selections() {
      const selections = [];

      for (const selection of this.filters.teams) {
        selections.push(selection);
      }

      return selections;
    },
  },

  async mounted() {
    console.log(this.$accessor);
    if (!this.hasRole("hard")) {
      await this.$router.push({
        path: "/index",
      });
    } else {
      // user has the HARD role
      this.users = (await this.$axios.get("/user")).data;
      this.users.filter((user) => user.isValid);
      this.filteredUsers = this.users;
      this.filters.isValidated = true; // default set to true
    }
  },

  methods: {
    getConfig(key) {
      return this.$accessor.config.getConfig(this, key);
    },

    getUser() {
      return getUser(this);
    },

    hasRole(role) {
      return this.$accessor.user.hasRole(role);
    },
    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },
  },
};
</script>

<style scoped>
p {
  margin: 0;
}

.v-btn-toggle--group > .v-btn.v-btn {
  margin: 0;
}

.container {
  padding: 0;
}
</style>
