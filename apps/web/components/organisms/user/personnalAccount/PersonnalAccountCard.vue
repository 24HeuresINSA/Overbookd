<template>
  <div style="height: 100%">
    <TransferDialog @transaction="updateCP" />
    <v-card
      height="100%"
      class="d-flex flex-column justify-space-between"
      :color="mBalance < 0 ? 'red' : ''"
    >
      <div>
        <v-card-title>Compte Perso 💰</v-card-title>
        <v-card-subtitle>Solde : {{ mBalance.toFixed(2) }} €</v-card-subtitle>
        <v-card-text>
          <v-data-table
            :headers="headers"
            hide-default-footer
            hide-default-header
            :items="displayedTransactionHistory"
          >
            <template #[`item.type`]="{ item }">
              <v-icon>
                {{
                  isNegativeTransaction(item)
                    ? "mdi-cash-minus"
                    : "mdi-cash-plus"
                }}
              </v-icon>
            </template>
            <template #[`item.amount`]="{ item }">
              {{ item.amount.toFixed ? item.amount.toFixed(2) : item.amount }} €
            </template>
            <template #[`item.context`]="{ item }">
              {{ item.isDeleted ? "[SUPPRIME] " : "" }}{{ item.context }}
            </template>
            <template #[`item.createdAt`]="{ item }">
              {{
                new Date(item.createdAt).toLocaleDateString("fr-FR", {
                  timeZone: "Europe/Paris",
                })
              }}
            </template>
          </v-data-table>
        </v-card-text>
      </div>
      <v-responsive>
        <v-card-actions>
          <v-btn text small @click="openDialog()">
            Effectuer un virement
          </v-btn>
          <v-btn text small to="/my-transactions">Mes transactions</v-btn>
        </v-card-actions>
      </v-responsive>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TransferDialog from "~/components/molecules/user/TransferDialog.vue";
import { Transaction } from "~/utils/models/transaction.model";

export default Vue.extend({
  name: "PersonnalAccountCard",
  components: { TransferDialog },
  data() {
    return {
      headers: [
        { text: "type", value: "type" },
        { text: "context", value: "context" },
        { text: "date", value: "createdAt" },
        { text: "montant", value: "amount", align: "end" },
      ],
    };
  },
  computed: {
    displayedTransactionHistory(): Transaction[] {
      return this.mTransactions.slice(0, 5);
    },
    mBalance() {
      return this.$accessor.user.me.balance || 0;
    },
    me() {
      return this.$accessor.user.me;
    },
    mTransactions() {
      return this.$accessor.transaction.mTransactions;
    },
  },
  async mounted() {
    await this.$accessor.transaction.fetchMTransactions();
  },
  methods: {
    async openDialog(): Promise<void> {
      this.$store.dispatch("dialog/openDialog", "transfer");
    },

    isNegativeTransaction(transaction: Transaction) {
      switch (transaction.type) {
        case "DEPOSIT":
          return false;
        case "TRANSFER":
          return transaction.from === this.me.id;
        case "EXPENSE":
          return true;
        default:
          return false;
      }
    },
    updateCP(amount: number): void {
      this.$store.commit("user/UPDATE_USER", {
        balance: this.mBalance - amount,
      });
    },
  },
});
</script>
