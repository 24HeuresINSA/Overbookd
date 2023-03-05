<template>
  <v-container>
    <h1>Transactions 💸</h1>
    <v-card style="margin-bottom: 5px">
      <v-card-text
        style="display: flex; flex-direction: row; align-items: center"
      >
        <v-autocomplete
          v-model="selectedUserID"
          label="Nom"
          :items="usernames"
          item-text="username"
          item-value="id"
          style="width: 300px"
        ></v-autocomplete>
        <v-btn icon @click="search(selectedUserID)">
          <v-icon>mdi-account-search</v-icon>
        </v-btn>
        <v-btn icon @click="clear()">
          <v-icon>mdi-spray-bottle</v-icon>
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
import { RepoFactory } from "~/repositories/repoFactory";
import OverTransactions from "~/components/OverTransactions.vue";
const { safeCall } = require("../utils/api/calls");

export default {
  name: "Transactions",
  components: { OverTransactions },
  data: () => {
    return {
      transactions: [],
      filteredTransactions: [],
      usernames: [],
      selectedUserID: undefined,
    };
  },
  computed: {},

  async beforeMount() {
    const usersCall = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsernamesWithCP(this)
    );
    if (usersCall) {
      this.usernames = usersCall.data;
    }
  },

  async mounted() {
    if (!this.$accessor.user.hasPermission("manage-cp")) {
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
    search(id) {
      this.filteredTransactions = this.transactions.filter((t) => {
        return t.user_from.id === id || t.user_to.id === id;
      });
    },
    clear() {
      this.filteredTransactions = this.transactions;
    },
  },
};
</script>

<style scoped></style>
