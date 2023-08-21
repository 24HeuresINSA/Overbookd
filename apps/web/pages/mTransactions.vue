<template>
  <div>
    <h1>Transactions de {{ me.firstname + " " + me.lastname }}</h1>
    <h2>Solde compte perso {{ mBalance.toFixed(2) }} €</h2>
    <OverTransactions :transactions="mTransactions"></OverTransactions>
  </div>
</template>

<script>
import OverTransactions from '~/components/organisms/user/personnalAccount/OverTransactions.vue';
import { RepoFactory } from '~/repositories/repo-factory';
import { safeCall } from '~/utils/api/calls';

export default {
  name: 'MTransactions',
  components: { OverTransactions },
  data: () => {
    return {
      mTransactions: [],
    };
  },

  head: () => ({
    title: 'Mes transactions',
  }),

  computed: {
    mBalance() {
      return this.$accessor.user.me.balance || 0;
    },
    me() {
      return this.$accessor.user.me;
    },
  },

  async mounted() {
    const res = await safeCall(
      this.$store,
      RepoFactory.TransactionRepository.getUserTransactions(this)
    );
    if (res) {
      this.mTransactions = res.data;
    }
  },
};
</script>

<style scoped></style>
