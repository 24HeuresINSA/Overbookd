<template>
  <div>
    <template style="display: grid">
      <v-row>
        <v-col md="2">
          <v-card>
            <v-card-title>Filtres</v-card-title>
            <v-card-text>
              <v-text-field
                v-model="filters.search"
                label="Recherche"
              ></v-text-field>
              <v-switch
                v-model="filters.hasDriverLicence"
                label="Permis"
              ></v-switch>
              <v-switch
                v-model="filters.notValidated"
                label="non validés"
              ></v-switch>
              <v-container class="py-0">
                <v-row align="center" justify="start">
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
                        close
                        :color="getRoleMetadata(item).color"
                      >
                        <v-icon left color="white">
                          {{ getRoleMetadata(item).icon }}
                        </v-icon>
                        <a style="color: white">{{
                          getRoleMetadata(item).name
                        }}</a>
                      </v-chip>
                    </template>
                  </v-combobox>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="filteredUsers"
            :items-per-page="30"
            class="elevation-1"
          >
            <template #[`item.action`]="{ item }">
              <v-btn
                fab
                style="color: blue"
                class="fab"
                :href="
                  'https://www.facebook.com/search/top?q=' +
                  item.firstname +
                  ' ' +
                  item.lastname
                "
                >F
              </v-btn>
              <v-btn
                v-if="hasRole('admin')"
                fab
                class="fab"
                @click="openTransactionDialog(item)"
                ><v-icon>mdi-cash</v-icon></v-btn
              >
              <v-btn
                v-if="hasRole('hard')"
                fab
                class="fab"
                @click="openInformationDialog(item)"
                ><v-icon>mdi-information-outline</v-icon></v-btn
              >
            </template>

            <template #[`item.team`]="{ item }">
              <OverChips :roles="item.team"></OverChips>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
      <div></div>
    </template>

    <v-dialog v-model="isTransactionDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Ajouter de 💰</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newTransaction.reason"
            label="reason"
          ></v-text-field>
          <v-text-field
            v-model="newTransaction.amount"
            label="montant (en euro)"
            type="number"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="transaction()">+</v-btn>
          <v-btn @click="transaction(true)">-</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isInformationDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Info sur l'utilisateur</v-card-title>
        <!--      <v-card-subtitle>{{this.selectedUser.nickname ? this.selectedUser.nickname : this.selectedUser.lastname}}</v-card-subtitle>-->
        <v-card-text>
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-left">champ</th>
                  <th class="text-left">valeur</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in desserts" :key="item.name">
                  <td>{{ item.name }}</td>
                  <td>{{ item.calories }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isUserDialogOpen" max-width="600">
      <v-card>
        <v-card-title>{{
          selectedUser.nickname ? selectedUser.nickname : selectedUser.lastname
        }}</v-card-title>
        <v-card-subtitle>
          <OverChips :roles="selectedUser.team"></OverChips>
        </v-card-subtitle>
        <v-card-text>
          <div v-if="hasRole(['admin', 'bureau'])">
            <v-select
              v-model="newRole"
              label="ajouter un role"
              :items="getConfig('teams').map((e) => e.name)"
            ></v-select>
            <v-btn @click="addRole()">ajouter</v-btn>
          </div>

          <v-img
            v-if="selectedUser.pp"
            :src="getPPUrl() + 'api/user/pp/' + selectedUser.pp"
          ></v-img>

          <v-simple-table>
            <tbody>
              <tr>
                <td>Nom</td>
                <td>
                  {{ selectedUser.lastname }} {{ selectedUser.firstname }}
                </td>
              </tr>

              <tr>
                <td>Surnom</td>
                <td>
                  <v-text-field
                    v-if="hasRole(['admin', 'SG'])"
                    v-model="selectedUser.nickname"
                  ></v-text-field>
                  <span v-else>{{ selectedUser.nickname }}</span>
                </td>
              </tr>

              <tr>
                <td>Date de naissance</td>
                <td>{{ selectedUser.birthdate }}</td>
              </tr>

              <tr>
                <td>tel</td>
                <td>+33 {{ selectedUser.phone }}</td>
              </tr>

              <tr>
                <td>Charisme</td>
                <td>{{ selectedUser.charisma }}</td>
              </tr>

              <tr>
                <td>Nombre de dispo</td>
                <td>
                  {{
                    selectedUser.availabilities
                      ? selectedUser.availabilities.length
                      : 0
                  }}
                </td>
              </tr>

              <tr>
                <td>email</td>
                <td>{{ selectedUser.email }}</td>
              </tr>

              <tr>
                <td>compte perso</td>
                <td>{{ selectedUser.balance }}</td>
              </tr>

              <tr>
                <td>amis</td>
                <td>
                  {{
                    selectedUser.friends
                      ? selectedUser.friends.map((f) => f.username).join(", ")
                      : ""
                  }}
                </td>
              </tr>

              <tr>
                <td>keycloakID</td>
                <td>{{ selectedUser.keycloakID }}</td>
              </tr>

              <tr>
                <td>ID</td>
                <td>{{ selectedUser._id }}</td>
              </tr>

              <tr>
                <td>Handicap</td>
                <td>{{ selectedUser.handicap }}</td>
              </tr>

              <tr>
                <td>📚</td>
                <td>{{ selectedUser.year }} {{ selectedUser.departement }}</td>
              </tr>

              <tr>
                <td>Commentaire</td>
                <td>{{ selectedUser.comment }}</td>
              </tr>

              <tr v-if="hasRole('admin')">
                <td># secu social</td>
                <td>{{ selectedUser.socialSecurity }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="saveUser()">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" :timeout="5000">
      💸 transaction done 🥳

      <template #action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import { getConfig, getUser, hasRole } from "../common/role";
import OverChips from "../components/overChips";
import Fuse from "fuse.js";

export default {
  name: "Humans",
  components: { OverChips },
  data() {
    return {
      users: [],
      filteredUsers: [],
      headers: [
        { text: "prenom", value: "firstname" },
        { text: "nom", value: "lastname" },
        { text: "surnom", value: "nickname" },
        { text: "team", value: "team" },
        { text: "charsime", value: "charisma" },
        { text: "action", value: "action" },
      ],

      teams: getConfig(this, "teams"),
      loading: false,

      filters: {
        search: undefined,
        hasDriverLicence: undefined,
        teams: [],
        notValidated: undefined,
      },

      isTransactionDialogOpen: false,
      isInformationDialogOpen: false,
      isUserDialogOpen: false,
      isSnackbarOpen: false,
      selectedUser: {
        nickname: undefined,
      },
      newTransaction: {
        reason: "recharge compte perso",
        amount: undefined,
      },
      newRole: undefined,
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
            keys: ["firstname", "lastname", "nickname"],
          };
          const fuse = new Fuse(mUsers, options);

          mUsers = fuse.search(this.filters.search).map((e) => e.item);
        }

        // filter by driver licence
        if (this.filters.hasDriverLicence) {
          mUsers = mUsers.filter(
            (user) => user.hasDriverLicence === this.filters.hasDriverLicence
          );
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

        // filter by not validated
        if (this.filters.notValidated) {
          this.filteredUsers = mUsers.filter((user) => {
            if (user.team) {
              return user.team.length === 0;
            } else {
              return true;
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
    if (!this.hasRole("hard")) {
      await this.$router.push({
        path: "/index",
      });
    } else {
      // user has the HARD role
      this.users = (await this.$axios.get("/user")).data;
      this.filteredUsers = this.users;
    }
  },

  methods: {
    async addRole() {
      let user = this.selectedUser;
      if (user.team === undefined) {
        user.team = [];
      }
      if (user.team.find((role) => role === this.newRole)) {
        // already has role
      } else {
        user.team.push(this.newRole);
        this.$set(user, "team", user.team); // update rendering
        await this.$axios.put(`/user/${user.keycloakID}`, { team: user.team });
      }
    },

    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },

    getConfig(key) {
      return getConfig(this, key);
    },

    getUser() {
      return getUser(this);
    },

    hasRole(role) {
      return hasRole(this, role);
    },

    openTransactionDialog(user) {
      this.isTransactionDialogOpen = true;
      this.selectedUser = user;
    },

    openInformationDialog(user) {
      this.selectedUser = user;
      this.isUserDialogOpen = true;
    },

    async transaction(isNegative) {
      if (!this.selectedUser.transactionHistory) {
        this.selectedUser.transactionHistory = [];
      }

      if (this.selectedUser.balance === undefined) {
        this.selectedUser.balance = 0;
      }

      if (isNegative) {
        this.selectedUser.balance =
          +this.selectedUser.balance - +this.newTransaction.amount;
      } else {
        this.selectedUser.balance +=
          +this.selectedUser.balance + +this.newTransaction.amount;
      }

      this.newTransaction.amount =
        (isNegative ? "- " : "+ ") + this.newTransaction.amount;
      this.selectedUser.transactionHistory.unshift(this.newTransaction);

      await this.$axios.put(
        "/user/" + this.selectedUser.keycloakID,
        this.selectedUser
      );
      this.isSnackbarOpen = true;
      this.isTransactionDialogOpen = false;
    },

    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },

    async saveUser() {
      await this.$axios.put(
        `/user/${this.selectedUser.keycloakID}`,
        this.selectedUser
      );
      this.isInformationDialogOpen = false;
    },
  },
};
</script>

<style scoped>
.fab {
  margin: 5px;
}
</style>
