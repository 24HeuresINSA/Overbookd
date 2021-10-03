<template>
  <div style="height: 100%">
    <TransferDialog />
    <v-card
      v-if="me"
      height="100%"
      class="d-flex flex-column justify-space-between"
    >
      <div>
        <v-card-title>Compte Perso 💰</v-card-title>
        <v-card-subtitle>Solde : {{ me.balance || 0 }} €</v-card-subtitle>
        <v-card-text v-if="mTransactions">
          <v-data-table :headers="headers" :items="displayedTransactionHistory">
            <template #[`item.amount`]="{ item }">
              {{ (item.amount || 0).toFixed(2) }} €
            </template>
          </v-data-table>
        </v-card-text>
      </div>
      <v-card-actions>
        <v-btn text @click="openDialog()">Effectuer un virement</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import TransferDialog from "~/components/molecules/transferDialog.vue";
import { RepoFactory } from "~/repositories/repoFactory";

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

      mTransactions: [],
    };
  },
  computed: {
    displayedTransactionHistory(): any {
      return this.mTransactions.slice(-3);
    },
  },
  mounted() {
    this.mTransactions = RepoFactory.get("transaction");
  },
  methods: {
    openDialog(): any {
      this.$store.dispatch("dialog/openDialog", "transfer");
    },
  },
});
</script>
