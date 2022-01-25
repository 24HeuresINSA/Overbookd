<template>
  <div style="height: 100%">
    <TransferDialog />
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
              {{ !item.isValid ? "[SUPPRIME] " : "" }}{{ item.context }}
            </template>
          </v-data-table>
        </v-card-text>
      </div>
      <v-card-actions>
        <v-btn v-if="areTransfersOpen" text @click="openDialog()"
          >Effectuer un virement
        </v-btn>
        <v-btn text to="/mTransactions">Mes transactions </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TransferDialog from "~/components/molecules/transferDialog.vue";
import { Transaction } from "~/utils/models/repo";

export default Vue.extend({
  name: "ComptePersosCard",
  components: { TransferDialog },
  data() {
    return {
      headers: [
        { text: "type", value: "type" },
        { text: "context", value: "context" },
        { text: "montant", value: "amount", align: "end" },
      ],
      areTransfersOpen: false,
    };
  },
  computed: {
    displayedTransactionHistory(): any {
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
    // let res = await RepoFactory.transactionRepo.getUserTransactions(this);
    await this.$accessor.transaction.fetchMTransactions();
    this.areTransfersOpen =
      this.$accessor.config.getConfig("are_transfers_open");
  },
  methods: {
    openDialog(): any {
      this.$store.dispatch("dialog/openDialog", "transfer");
    },

    isNegativeTransaction(transaction: Transaction) {
      return transaction.from === this.me._id;
    },
  },
});
</script>
