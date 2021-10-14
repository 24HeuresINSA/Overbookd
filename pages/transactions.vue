<template>
  <v-container>
    <h1>Transactions 💸</h1>
    <v-card style="margin-bottom: 5px">
      <v-card-text
        style="display: flex; flex-direction: row; align-items: center"
      >
        <v-autocomplete
          v-model="selectedUserKeycloakID"
          label="Nom"
          :items="usernames"
          item-text="username"
          item-value="keycloakID"
          style="width: 300px"
        ></v-autocomplete>
        <v-btn icon @click="search(selectedUserKeycloakID)">
          <v-icon>mdi-account-search</v-icon>
        </v-btn>
      </v-card-text>
    </v-card>

    <OverTransactions
      :transactions="filteredTransactions"
      :action="true"
    ></OverTransactions>
  </v-container>
</template>

<script>
import OverTransactions from "../components/overTransactions";
const { safeCall } = require("../utils/api/calls");
import { RepoFactory } from "~/repositories/repoFactory";

export default {
  name: "Transactions",
  components: { OverTransactions },
  data: () => {
    return {
      transactions: [],
      filteredTransactions: [],
      usernames: [],
      selectedUserKeycloakID: undefined,
    };
  },
  computed: {},

  async beforeMount() {
    const usersCall = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsernames(this)
    );
    if (usersCall) {
      this.usernames = usersCall.data;
    }
  },

  async mounted() {
    if (!(await this.$accessor.user.hasRole("admin"))) {
      await this.$router.push({
        path: "/",
      });
      return;
    }

    const res = await safeCall(
      this.$store,
      RepoFactory.transactionRepo.getTransactions(this)
    );
    if (res) {
      this.transactions = res.data;
      this.filteredTransactions = this.transactions;
    }
  },

  methods: {
    search(keycloakID) {
      this.filteredTransactions = this.filteredTransactions.filter((t) => {
        return t.from === keycloakID || t.to === keycloakID;
      });
      // this.$set(this, "filteredTransactions", filteredTransactions)
    },
  },
};
</script>

<style scoped></style>
