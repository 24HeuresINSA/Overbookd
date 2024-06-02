<template>
  <v-container>
    <h1>Transactions 💸</h1>
    <v-card>
      <v-card-text class="transactions-content">
        <v-autocomplete
          v-model="selectedUserId"
          label="Nom"
          :items="consumers"
          :item-text="displayUserName"
          item-value="id"
          class="filter"
        ></v-autocomplete>
        <v-btn icon @click="search(selectedUserId)">
          <v-icon>mdi-account-search</v-icon>
        </v-btn>
        <v-btn icon @click="clear">
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
import OverTransactions from "~/components/organisms/personal-account/OverTransactions.vue";
import { TransactionRepository } from "~/repositories/transaction.repository";
import { safeCall } from "~/utils/api/calls";
import { formatUsername } from "~/utils/user/user.utils";

export default {
  name: "Transactions",
  components: { OverTransactions },
  data: () => {
    return {
      transactions: [],
      filteredTransactions: [],
      selectedUserId: undefined,
    };
  },

  head: () => ({
    title: "Transactions",
  }),

  computed: {
    consumers() {
      return this.$accessor.user.personalAccountConsumers;
    },
  },

  async created() {
    await this.$accessor.user.fetchPersonalAccountConsumers();
  },

  async mounted() {
    const res = await safeCall(
      this.$store,
      TransactionRepository.getTransactions(this),
    );
    if (res) {
      this.transactions = res.data;
      this.filteredTransactions = this.transactions;
    }
  },

  methods: {
    search(id) {
      this.filteredTransactions = this.transactions.filter((t) => {
        return t.payor.id === id || t.payee.id === id;
      });
    },
    clear() {
      this.filteredTransactions = this.transactions;
    },
    displayUserName(user) {
      return formatUsername(user);
    },
  },
};
</script>

<style lang="scss" scoped>
.transactions-content {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filter {
  width: 300px;
}
</style>
