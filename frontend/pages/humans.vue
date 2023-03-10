<template>
  <div>
    <div style="width: 100%; display: grid">
      <v-row>
        <v-col md="2">
          <v-card style="margin-bottom: 5%">
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
                :items="teams.map((team) => team.name)"
              >
                <template #selection="{ attrs, item, selected }">
                  <v-chip
                    v-bind="attrs"
                    :input-value="selected"
                    close
                    :color="getRoleMetadata(item).color"
                    @click:close="removeTeamInFilter(item)"
                  >
                    <v-icon left color="white">
                      {{ getRoleMetadata(item).icon }}
                    </v-icon>
                    <a style="color: white">{{ getRoleMetadata(item).name }}</a>
                  </v-chip>
                </template>
              </v-combobox>

              <template v-if="hasPermission('manage-users')">
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
              <template v-if="hasPermission('bureau')">
                <p>Cotisation</p>
                <v-btn-toggle
                  v-model="filters.hasPayedContribution"
                  tile
                  color="deep-purple accent-3"
                  group
                >
                  <v-btn :value="true" small>Payée</v-btn>

                  <v-btn :value="false" small> Non payée</v-btn>
                </v-btn-toggle>
              </template>
            </v-card-text>
          </v-card>
          <v-card v-if="hasPermission('manage-users')">
            <v-card-title>Mode stats humains</v-card-title>
            <v-card-text style="display: flex; flex-direction: column">
              <label>Mode stats</label>
              <v-btn-toggle
                v-model="isModeStatsActive"
                tile
                color="deep-purple accent-3"
                group
              >
                <v-btn :value="true" small> oui</v-btn>
                <v-btn :value="false" small> Non</v-btn>
              </v-btn-toggle>
            </v-card-text>
            <v-card-text>
              <v-btn text @click="exportCSV">exporter</v-btn>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col md="10">
          <div v-if="!loading">
            <v-data-table
              v-if="!isModeStatsActive"
              style="max-height: 100%; overflow-y: auto"
              :headers="headers"
              :items="filteredUsers"
              :options.sync="options"
              class="elevation-1"
              dense
              :items-per-page="20"
            >
              <template #[`item.firstname`]="{ item }">
                {{ item.firstname }} {{ item.lastname }}
                {{ item.nickname ? `(${item.nickname})` : "" }}
              </template>
              <template #[`item.action`]="{ item }" style="display: flex">
                <v-btn
                  v-if="hasPermission('hard')"
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
                  v-if="hasPermission('manage-users')"
                  icon
                  small
                  @click="openCalendar(item._id)"
                >
                  <v-icon small>mdi-calendar</v-icon>
                </v-btn>
              </template>

              <template #[`item.balance`]="{ item }">
                {{ getCP(item) }}
              </template>

              <template #[`item.charisma`]="{ item }">
                {{ item.charisma || 0 }}
              </template>

              <template #[`item.team`]="{ item }">
                <v-container>
                  <OverChips :roles="item.team"></OverChips>
                </v-container>
              </template>
            </v-data-table>
            <v-data-table
              v-else
              style="max-height: 100%; overflow-y: auto"
              :headers="statsHeaders"
              :items="filteredUsers"
              :options.sync="options"
              class="elevation-1"
              dense
              :items-per-page="20"
            >
              <template #[`item.firstname`]="{ item }">
                {{ item.firstname }} {{ item.lastname }}
                {{ item.nickname ? `(${item.nickname})` : "" }}
              </template>

              <template #[`item.action`]="{ item }" style="display: flex">
                <v-btn
                  v-if="hasPermission('hard')"
                  icon
                  small
                  @click="openInformationDialog(item)"
                >
                  <v-icon small>mdi-information-outline</v-icon>
                </v-btn>
                <v-btn
                  v-if="hasPermission('manage-users')"
                  icon
                  small
                  @click="openCalendar(item._id)"
                >
                  <v-icon small>mdi-calendar</v-icon>
                </v-btn>
              </template>

              <template #[`item.charisma`]="{ item }">
                {{ item.charisma || 0 }}
              </template>

              <template #[`item.charge`]="{ item }">
                {{ `${item.charge || 0} %` }}
              </template>
              <template #[`item.hours`]="{ item }">
                {{ item.hours || 0 }}</template
              >
              <template #[`item.statics`]="{ item }">
                {{ item.statics || 0 }}</template
              >

              <template #[`item.team`]="{ item }">
                <v-container style="max-width: 150px">
                  <OverChips :roles="item.team"></OverChips>
                </v-container>
              </template>
            </v-data-table>
          </div>
          <div v-else class="d-flex justify-center">
            <v-progress-circular
              indeterminate
              color="grey"
            ></v-progress-circular>
          </div>
        </v-col>
      </v-row>
    </div>

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
      :toggle="isUserDialogOpen"
      @update-toggle="(t) => (isUserDialogOpen = t)"
    ></UserInformation>
  </div>
</template>

<script>
import Fuse from "fuse.js";
import OverChips from "~/components/atoms/OverChips.vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import UserInformation from "~/components/organisms/UserInformation.vue";

const { RepoFactory } = require("../repositories/repoFactory");

export default {
  name: "Humans",
  components: {
    UserInformation,
    SnackNotificationContainer,
    OverChips,
  },
  data() {
    return {
      filteredUsers: [],
      headers: [
        { text: "Prénom Nom (Surnom)", value: "firstname" },
        { text: "Team", value: "team" },
        { text: "Charisme", value: "charisma", align: "end" },
        { text: "Action", value: "action", sortable: false },
      ],
      statsHeaders: [
        { text: "Prénom Nom (Surnom)", value: "firstname" },
        { text: "Charisme", value: "charisma", align: "end" },
        { text: "Charge", value: "charge" },
        { text: "Heures affectés", value: "hours" },
        { text: "Statiques", value: "statics" },
        { text: "Action", value: "action", sortable: false },
      ],

      loading: false,

      filters: {
        search: undefined,
        teams: [],
        isValidated: undefined,
        hasPayedContribution: undefined,
      },

      isUserDialogOpen: false,
      isSnackbarOpen: false,

      newRole: undefined,

      feedbackMessage: "Sauvegardé 🥳",

      isModeStatsActive: false,

      options: {
        page: 1,
      },
    };
  },

  computed: {
    users() {
      return this.$accessor.user.users;
    },
    teams() {
      return this.$accessor.team.allTeams
    },
  },

  watch: {
    filters: {
      handler() {
        this.updateFilteredUsers();
      },
      deep: true,
    },

    users: {
      handler() {
        this.updateFilteredUsers();
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
    isModeStatsActive() {
      if (this.isModeStatsActive) {
        this.initStats();
      }
    },
  },

  async mounted() {
    await this.$accessor.user.fetchUsers();
    if (!this.hasPermission("hard")) {
      return this.$router.push({
        path: "/",
      });
    }
    this.filters.isValidated = true; // default set to true

    // add CP if admin or sg
    if (this.hasPermission("sg")) {
      this.headers.splice(this.headers.length - 1, 0, {
        text: "CP",
        value: "balance",
        align: "end",
      });
    }
  },

  methods: {
    async initStore() {
      await this.$accessor.user.fetchUser();
      await this.$accessor.timeslot.fetchTimeslots();
      await this.$accessor.FT.fetchAll();
    },
    isCpUseful(item) {
      return (
        (item.team?.includes("hard") &&
          !(
            item.team?.includes("fen") ||
            item.team?.includes("voiture") ||
            item.team?.includes("camion")
          )) ||
        item.team?.includes("vieux")
      );
    },
    getCP(item) {
      return this.isCpUseful(item)
        ? (item.balance || 0).toFixed(2) + " €"
        : undefined;
    },

    hasPermission(permission) {
      return this.$accessor.user.hasPermission(permission);
    },

    getPPUrl() {
      return process.env.NODE_ENV === "development"
        ? "http://localhost:2424/"
        : "";
    },

    openInformationDialog(user) {
      this.$accessor.user.setSelectedUser(user);
      this.isUserDialogOpen = true;
    },

    getRoleMetadata(roleName) {
      return this.teams.find((e) => e.name === roleName);
    },

    removeTeamInFilter(item) {
      this.filters.teams.splice(this.filters.teams.indexOf(item), 1);
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
        "Prénom;Nom;Surnom;Charisme;Poles;Email;Date de naissance;Téléphone;Département;Année;Solde;ContribPayée;Commentaire\n";

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
          users[i].has_payed_contributions +
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
    async initStats() {
      this.loading = true;
      await RepoFactory.ftRepo.getOrgaRequis(this).then((res) => {
        const allPlanning = res.data;
        let final = [];
        let allStatic = [];
        let allAffected = [];
        allPlanning.forEach((plan) => {
          const returnValue = {
            _id: plan._id,
            charge: this.getCharge(plan),
          };
          const staticValue = {
            _id: plan._id,
            statics: this.getStatic(plan),
          };
          const affectedHours = {
            _id: plan._id,
            affected: this.getAffected(plan),
          };
          final.push(returnValue);
          allStatic.push(staticValue);
          allAffected.push(affectedHours);
        });
        this.filteredUsers.forEach((user) => {
          const userCharge = final.find((e) => e._id === user._id);
          const userStatic = allStatic.find((e) => e._id === user._id);
          const userAffected = allAffected.find((e) => e._id === user._id);
          if (userCharge) {
            user.charge = Math.round(userCharge.charge * 100) / 100;
          }
          if (userStatic) {
            user.statics = Math.round(userStatic.statics * 100) / 100;
          }
          if (userAffected) {
            user.hours = Math.round(userAffected.affected * 100) / 100;
          }
        });
        this.loading = false;
      });
    },
    getCharge(plan) {
      let charge = 0;
      plan.slots.forEach((slot) => {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        const time = end.getTime() - start.getTime();
        charge += time;
      });
      const user = this.users.find((e) => e._id === plan._id);
      const hours = user.availabilities.length * 2 || 0;
      if (charge === 0 || hours === 0) {
        return 0;
      } else {
        return (charge / (hours * 3600000)) * 100;
      }
    },
    getAffected(plan) {
      let total = 0;
      plan.slots.forEach((slot) => {
        const start = new Date(slot.start);
        const end = new Date(slot.end);
        const time = end.getTime() - start.getTime();
        total += time;
      });
      return Math.round(total / 3600000);
    },
    getStatic(plan) {
      let statics = 0;
      const Fts = this.$accessor.FT.Fts;
      plan.slots.forEach((slot) => {
        const ft = Fts.find((e) => e.count === slot.count);
        if (ft.general.areTimeframesStatic) {
          statics++;
        }
      });
      return statics;
    },
    openCalendar(userID) {
      window.open("/calendar/" + userID, "_blank");
    },
    updateFilteredUsers() {
      let mUsers = this.users;

      // filter by search
      if (this.filters.search) {
        const options = {
          // Search in `author` and in `tags` array
          keys: ["firstname", "lastname", "nickname", "phone"],
        };
        const fuse = new Fuse(mUsers, options);

        mUsers = fuse.search(this.filters.search).map((e) => e.item);
        this.options.page = 1; // reset page
      }

      // filter by not validated
      if (this.filters.isValidated !== undefined) {
        mUsers = mUsers.filter(
          (user) =>
            this.$accessor.permission.isValidated(user) ===
            this.filters.isValidated
        );
        this.options.page = 1; // reset page
      }

      // filter by payed contributions
      if (this.filters.hasPayedContribution !== undefined) {
        if (this.filters.hasPayedContribution) {
          mUsers = mUsers.filter((user) => user.has_payed_contributions);
        } else {
          mUsers = mUsers.filter((user) => !user.has_payed_contributions);
        }
        this.options.page = 1; // reset page
      }

      // filter by team
      if (this.filters.teams.length > 0) {
        mUsers = mUsers.filter((user) => {
          if (user.team) {
            return (
              user.team.filter((value) => this.filters.teams.includes(value))
                .length === this.filters.teams.length
            );
          } else {
            return false;
          }
        });
        this.options.page = 1; // reset page
      }
      this.filteredUsers = mUsers;
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
