<template>
  <v-card>
    <v-card-title>Compte Perso 💰</v-card-title>
    <v-card-subtitle>Balance : {{ user.balance || 0 }} € </v-card-subtitle>
    <v-card-text v-if="user.transactionHistory">
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">Operation</th>
            <th class="text-right">€</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in displayedTransactionHistory" :key="i">
            <td>{{ item.reason }}</td>
            <td class="text-right">{{ item.amount }} €</td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn text @click="isTransferDialogOpen = true"
        >Effectuer un virement</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "ComptePersosCard",
  props: {
    user: {
      type: Object,
      default: () => ({
        transactionHistory: [
          {
            reason: "bierrasse",
            amount: 10,
          },
          {
            reason: "bierrasse2",
            amount: 20,
          },
        ],
        balance: 110,
      }),
    },
  },
  computed: {
    displayedTransactionHistory() {
      let result = [];
      if (this.user && this.user.transactionHistory) {
        let fullTransactionHistory = this.user.transactionHistory;
        fullTransactionHistory.forEach((transaction) => {
          if (result.length < 3) {
            result.push(transaction);
          }
        });
      }
      return result;
    },
  },
};
</script>
