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
            <template #[`item.action`]="{ item }" style="display: flex">
              <v-btn
                text
                style="color: blue"
                small
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
                text
                small
                @click="openTransactionDialog(item)"
              >
                <v-icon>mdi-cash</v-icon>
              </v-btn>
              <v-btn
                v-if="hasRole('hard')"
                text
                small
                @click="openInformationDialog(item)"
              >
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>
              <v-btn
                v-if="hasRole(['admin', 'bureau'])"
                text
                small
                @click="openCharismaDialog(item)"
              >
                <v-icon>mdi-emoticon-cool</v-icon>
              </v-btn>
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
        <v-img
          v-if="selectedUser.pp"
          :src="getPPUrl() + 'api/user/pp/' + selectedUser.pp"
          max-height="300px"
        ></v-img>
        <v-card-title
          >{{
            selectedUser.nickname
              ? selectedUser.nickname
              : selectedUser.lastname
          }}
        </v-card-title>
        <v-card-subtitle></v-card-subtitle>
        <v-card-text>
          <OverChips :roles="selectedUser.team"></OverChips>
          <div v-if="hasRole(['admin', 'bureau'])">
            <v-select
              v-model="newRole"
              label="ajouter un role"
              :items="getConfig('teams').map((e) => e.name)"
            ></v-select>
            <v-btn text @click="addRole()">ajouter</v-btn>
            <v-btn text @click="deleteAllTeams()"
              >révoquer tous les rôles
            </v-btn>
          </div>

          <v-simple-table>
            <tbody>
              <tr>
                <td>Nom</td>
                <td>
                  <v-text-field
                    v-model="selectedUser.lastname"
                    :disabled="!hasRole(['admin', 'human'])"
                  ></v-text-field>
                </td>
              </tr>

              <tr>
                <td>Prénom</td>
                <td>
                  <v-text-field
                    v-model="selectedUser.firstname"
                    :disabled="!hasRole(['admin', 'human'])"
                  ></v-text-field>
                </td>
              </tr>

              <tr>
                <td>Surnom</td>
                <td>
                  <v-text-field
                    v-model="selectedUser.nickname"
                    :disabled="!hasRole(['admin', 'human'])"
                  ></v-text-field>
                </td>
              </tr>

              <tr>
                <td>Date de naissance</td>
                <td>{{ selectedUser.birthdate }}</td>
              </tr>

              <tr>
                <td>tel</td>
                <td>
                  <v-text-field
                    v-model="selectedUser.phone"
                    :disabled="!hasRole(['admin', 'human'])"
                    type="number"
                  ></v-text-field>
                </td>
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
                <td>Email</td>
                <td>{{ selectedUser.email }}</td>
              </tr>

              <tr>
                <td>Balance compte perso</td>
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

              <tr v-if="hasRole('informatique')">
                <td>keycloakID</td>
                <td>{{ selectedUser.keycloakID }}</td>
              </tr>

              <tr v-if="hasRole('informatique')">
                <td>ID</td>
                <td>{{ selectedUser._id }}</td>
              </tr>

              <tr>
                <td>📚</td>
                <td>{{ selectedUser.year }} {{ selectedUser.departement }}</td>
              </tr>

              <tr>
                <td>Commentaire</td>
                <td>{{ selectedUser.comment }}</td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="saveUser()">sauvgarder</v-btn>
          <v-btn text @click="deleteUser()">supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isCharismaDialogOpen" max-width="600">
      <v-card>
        <v-card-title>Charisme 😎</v-card-title>
        <v-card-text>
          <v-text-field v-model="newCharisma.reason" label="raison">
          </v-text-field>
          <v-text-field
            v-model="newCharisma.amount"
            label="quantité"
            type="number"
          >
          </v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="saveNewCharisma()">+</v-btn>
          <v-btn text @click="saveNewCharisma(true)">-</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="isSnackbarOpen" :timeout="5000">
      {{ feedbackMessage }}

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
import OverChips from "../components/atoms/overChips";
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
      isCharismaDialogOpen: false,
      selectedUser: {
        nickname: undefined,
      },
      newTransaction: {
        reason: "recharge compte perso",
        amount: undefined,
      },
      newCharisma: {
        reason: undefined,
        amount: undefined,
      },
      newRole: undefined,

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
    openCharismaDialog(user) {
      this.selectedUser = user;
      this.isCharismaDialogOpen = true;
    },

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

    async saveNewCharisma(isNegative) {
      if (!this.selectedUser.charisma) {
        this.selectedUser.charisma = 0;
      }

      if (!this.selectedUser.charismaHistory) {
        this.selectedUser.charismaHistory = [];
      }
      this.newCharisma.amount =
        (isNegative ? "-" : "+") + this.newCharisma.amount;
      this.selectedUser.charismaHistory.unshift(this.newCharisma);

      this.selectedUser.charisma =
        +this.selectedUser.charisma + +this.newCharisma.amount;

      // update notifications
      if (!this.selectedUser.notifications) {
        this.selectedUser.notifications = [];
      }
      this.selectedUser.notifications.unshift({
        date: new Date(),
        team: "bureau",
        message: `tu as reçu ${this.newCharisma.amount} points de charisme pour ${this.newCharisma.reason}`,
        type: "charisma",
      });

      await this.$axios.put(
        "/user/" + this.selectedUser.keycloakID,
        this.selectedUser
      );
      this.isSnackbarOpen = true;
      this.isCharismaDialogOpen = false;
    },

    async transaction(isNegative) {
      if (!this.selectedUser.transactionHistory) {
        this.selectedUser.transactionHistory = [];
      }

      if (this.selectedUser.balance) {
        this.selectedUser.balance = 0;
      }

      this.newTransaction.amount = this.newTransaction.amount.replace(",", "."); // accept , in input

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
      this.isUserDialogOpen = false;
    },

    async deleteUser() {
      this.selectedUser.isValid = false;
      await this.saveUser();
    },

    async deleteAllTeams() {
      this.selectedUser.team = [];
      await this.$axios.put(
        `/user/${this.selectedUser.keycloakID}`,
        this.selectedUser
      );
    },
  },
};
</script>

<style scoped>
.fab {
  margin: 3px;
}
</style>
