<template>
  <div>
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

              <label>Compte validé</label>
              <template v-if="hasRole(['admin', 'bureau'])">
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
              <label>Permis</label>
              <div>
                <v-btn-toggle
                  v-model="filters.hasDriverLicense"
                  tile
                  color="deep-purple accent-3"
                  group
                >
                  <v-btn :value="true" small>oui</v-btn>

                  <v-btn :value="false" small>non</v-btn>
                </v-btn-toggle>
              </div>
              <template v-if="hasRole(['admin', 'bureau'])">
                <p>Cotisation</p>
                <v-btn-toggle
                  v-model="filters.hasPayedContribution"
                  tile
                  color="deep-purple accent-3"
                  group
                >
                  <v-btn :value="true" small> Payé</v-btn>

                  <v-btn :value="false" small> Non payé</v-btn>
                </v-btn-toggle>
                <v-btn text @click="exportCSV">exporter</v-btn>
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
            :items-per-page="-1"
          >
            <template #[`item.action`]="{ item }" style="display: flex">
              <v-btn
                v-if="hasRole('hard')"
                icon
                small
                @click="openInformationDialog(item)"
              >
                <v-icon small>mdi-information-outline</v-icon>
              </v-btn>
              <v-btn icon small :href="'tel:+33' + item.phone">
                <v-icon small>mdi-phone</v-icon>
              </v-btn>
              <v-btn icon small :href="'mailto:' + item.email">
                <v-icon small>mdi-email</v-icon>
              </v-btn>
              <v-btn
                v-if="hasRole('admin')"
                icon
                small
                @click="openTransactionDialog(item)"
              >
                <v-icon small>mdi-cash</v-icon>
              </v-btn>
              <v-btn
                v-if="hasRole(['admin', 'bureau'])"
                icon
                small
                @click="openCharismaDialog(item)"
              >
                <v-icon small>mdi-emoticon-cool</v-icon>
              </v-btn>
              <v-btn
                icon
                small
                :href="
                  'https://www.facebook.com/search/top?q=' +
                  item.firstname +
                  ' ' +
                  item.lastname
                "
              >
                <v-icon small>mdi-facebook</v-icon>
              </v-btn>
            </template>

            <template #[`item.balance`]="{ item }">
              {{ (item.balance || 0).toFixed(2) }} €
            </template>

            <template #[`item.studies`]="{ item }">
              {{ item.year }}{{ item.departement }}
            </template>

            <template #[`item.charisma`]="{ item }">
              {{ item.charisma || 0 }}
            </template>

            <template #[`item.team`]="{ item }">
              <v-container style="max-width: 150px">
                <OverChips :roles="item.team"></OverChips>
              </v-container>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
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

    <SnackNotificationContainer></SnackNotificationContainer>
    <UserInformation
      :user="selectedUser"
      :toggle="isUserDialogOpen"
      @update-toggle="(t) => (isUserDialogOpen = t)"
    ></UserInformation>
  </div>
</template>

<script>
import { getConfig, getUser, hasRole } from "../common/role";
import OverChips from "../components/atoms/overChips";
import Fuse from "fuse.js";
import SnackNotificationContainer from "../components/molecules/snackNotificationContainer";
import UserInformation from "../components/organisms/userInformation";

const { RepoFactory } = require("../repositories/repoFactory");

export default {
  name: "Humans",
  components: { UserInformation, SnackNotificationContainer, OverChips },
  data() {
    return {
      users: [],
      filteredUsers: [],
      headers: [
        { text: "prénom", value: "firstname" },
        { text: "nom", value: "lastname" },
        { text: "surnom", value: "nickname" },
        { text: "team", value: "team", cellClass: "width: 250px", width: "1" },
        { text: "étude", value: "studies" },
        { text: "charisme", value: "charisma", align: "end" },
        { text: "action", value: "action" },
      ],

      teams: getConfig(this, "teams"),
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
            keys: ["firstname", "lastname", "nickname", "phone"],
          };
          const fuse = new Fuse(mUsers, options);

          mUsers = fuse.search(this.filters.search).map((e) => e.item);
        }

        // filter by driver licence
        if (this.filters.hasDriverLicense !== undefined) {
          mUsers = mUsers.filter(
            (user) => user.hasDriverLicense === this.filters.hasDriverLicense
          );
        }

        // filter by not validated
        if (this.filters.isValidated !== undefined) {
          if (this.filters.isValidated) {
            mUsers = mUsers.filter((user) => user.team.length !== 0);
          } else {
            mUsers = mUsers.filter((user) => user.team.length === 0);
          }
        }

        // filter by payed contributions
        if (this.filters.hasPayedContribution !== undefined) {
          if (this.filters.hasPayedContribution) {
            mUsers = mUsers.filter((user) => user.hasPayedContribution);
          } else {
            mUsers = mUsers.filter((user) => !user.hasPayedContribution);
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

      // add CP if admin
      if (this.hasRole("admin")) {
        this.headers.splice(this.headers.length - 1, 0, {
          text: "CP",
          value: "balance",
          align: "end",
        });
      }
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
        await this.$axios.put(`/user/${user._id}`, { team: user.team });
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

    async saveNewCharisma(isExpense) {
      if (!this.selectedUser.charisma) {
        this.selectedUser.charisma = 0;
      }

      if (!this.selectedUser.charismaHistory) {
        this.selectedUser.charismaHistory = [];
      }
      this.newCharisma.amount =
        (isExpense ? "-" : "+") + this.newCharisma.amount;
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
        "/user/" + this.selectedUser._id,
        this.selectedUser
      );
      this.isSnackbarOpen = true;
      this.isCharismaDialogOpen = false;
    },

    async transaction(isExpense) {
      this.newTransaction.amount = this.newTransaction.amount.replace(",", "."); // accept , in input
      const amountNumber = +this.newTransaction.amount;

      if (amountNumber <= 0) {
        await this.$store.dispatch("notif/pushNotification", {
          type: "success",
          message: "les virments negatif sont interdit 🤑",
        });
        return;
      }

      let mTransaction = {
        type: isExpense ? "expense" : "deposit",
        from: isExpense ? this.selectedUser._id : null,
        to: isExpense ? null : this.selectedUser._id,
        context: this.newTransaction.reason,
        amount: amountNumber,
        createdAt: new Date(),
      };

      // update on screen
      if (this.selectedUser.balance === undefined) {
        this.selectedUser.balance = 0;
      }
      this.selectedUser.balance = +this.selectedUser.balance + amountNumber;
      try {
        let res = await RepoFactory.transactionRepo.createTransactions(this, [
          mTransaction,
        ]);
        if (res.status !== 200) {
          throw new Error();
        }
        await this.$store.dispatch("notif/pushNotification", {
          type: "success",
          message: "Transfer sent !",
        });
      } catch (error) {
        // let notif: SnackNotif = {
        //   type: "error",
        //   message: "Could not transfer",
        // };
        // await this.$store.dispatch("notif/pushNotification", notif);
      }
      this.isSnackbarOpen = true;
      this.isTransactionDialogOpen = false;
    },

    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },

    async saveUser() {
      await this.$axios.put(
        `/user/${this.selectedUser._id}`,
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
        `/user/${this.selectedUser._id}`,
        this.selectedUser
      );
    },

    download(filename, text) {
      // We use the 'a' HTML element to incorporate file generation into
      // the browser rather than server-side
      const element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + encodeURIComponent(text)
      );
      element.setAttribute("download", filename);

      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },

    async exportCSV() {
      // Parse data into a CSV string to be passed to the download function
      let csv =
        "Prénom;Nom;Surnom;Charisme;Poles;Email;Date de naissance;Téléphone;Département;Année;Solde;ContribPayée;A Le Permis?;Date permis;Commentaire\n";

      const users = this.users;
      for (let i = 0; i < users.length; i++) {
        csv +=
          users[i].firstname +
          ";" +
          users[i].lastname +
          ";" +
          users[i].nickname +
          ";" +
          users[i].charisma +
          ";" +
          '"' +
          users[i].team +
          '"' +
          ";" +
          users[i].email +
          ";" +
          users[i].birthdate +
          ";" +
          "+33" +
          users[i].phone +
          ";" +
          users[i].department +
          ";" +
          users[i].year +
          ";" +
          users[i].balance +
          ";" +
          users[i].hasPayedContribution +
          ";" +
          users[i].hasDriverLicense +
          ";" +
          users[i].driverLicenseDate +
          ";" +
          users[i].comment +
          ";" +
          "\n";
      }

      const regex = new RegExp(/undefined/i, "g");

      let parsedCSV = csv.replaceAll(regex, "");
      // Prompt the browser to start file download
      this.download("utilisateurs.csv", parsedCSV);
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
