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
import { RepoFactory } from "~/repositories/repo-factory";
import OverTransactions from "~/components/organisms/user/personnalAccount/OverTransactions.vue";
import { safeCall } from "~/utils/api/calls";

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
  head: () => ({
    title: "Transactions",
  }),

  async beforeMount() {
    const usersCall = await safeCall(
      this.$store,
      RepoFactory.UserRepository.getAllUsernamesWithCP(this)
    );
    if (usersCall) {
      this.usernames = usersCall.data;
    }
  },

  async mounted() {
    const res = await safeCall(
      this.$store,
      RepoFactory.TransactionRepository.getTransactions(this)
    );
    if (res) {
      this.transactions = res.data;
      this.filteredTransactions = this.transactions;
    }
  },

  methods: {
    search(id) {
      this.filteredTransactions = this.transactions.filter((t) => {
        return t.userFrom.id === id || t.userTo.id === id;
      });
    },
    clear() {
      this.filteredTransactions = this.transactions;
    },
  },
};
</script>

<style scoped></style>
