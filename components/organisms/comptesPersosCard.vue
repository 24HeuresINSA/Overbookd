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
        <v-card-subtitle>Balance : {{ me.balance || 0 }} € </v-card-subtitle>
        <v-card-text v-if="me.transactionHistory">
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
      </div>
      <v-card-actions>
        <v-btn text @click="openDialog()">Effectuer un virement</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import { UserState } from "~/store/user";
import { Transaction } from "~/utils/models/repo";
import { TMapState } from "~/utils/types/store";
import TransferDialog from "~/components/molecules/transferDialog.vue";
export default Vue.extend({
  name: "ComptePersosCard",
  components: { TransferDialog },
  computed: {
    ...mapState<any, TMapState<UserState>>("user", {
      me: (state) => state.me,
    }),
    displayedTransactionHistory() {
      let result: Transaction[] = [];
      if (this.me.transactionHistory) {
        let fullTransactionHistory = this.me.transactionHistory;
        fullTransactionHistory.forEach((transaction) => {
          if (result.length < 3) {
            result.push(transaction);
          }
        });
      }
      return result;
    },
  },
  methods: {
    openDialog() {
      this.$store.dispatch("dialog/openDialog", "transfer");
    },
  },
});
</script>
