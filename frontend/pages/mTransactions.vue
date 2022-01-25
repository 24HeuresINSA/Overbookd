<template>
  <div>
    <h1>Transac sur TikTok 🤑</h1>
    <h2>Solde compte perso {{ mBalance.toFixed(2) }} €</h2>
    <OverTransactions :transactions="mTransactions"></OverTransactions>
  </div>
</template>

<script>
import OverTransactions from "../components/overTransactions";

const { safeCall } = require("../utils/api/calls");
import { RepoFactory } from "~/repositories/repoFactory";

export default {
  name: "MTransactions",
  components: { OverTransactions },
  data: () => {
    return {
      mTransactions: [],
    };
  },

  computed: {
    mBalance() {
      return this.$accessor.user.me.balance || 0;
    },
  },

  async mounted() {
    const res = await safeCall(
      this.$store,
      RepoFactory.transactionRepo.getUserTransactions(this)
    );
    if (res) {
      this.mTransactions = res.data;
    }
  },
};
</script>

<style scoped></style>
