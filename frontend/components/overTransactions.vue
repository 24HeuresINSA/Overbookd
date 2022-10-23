<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="transactions"
      dense
      :items-per-page="-1"
    >
      <template #[`group.summary`]="{ group }">
        {{ new Date(group).toLocaleString() }}
      </template>

      <template #[`item.type`]="{ item }">
        <label :style="item.is_deleted ? 'background-color: red' : ''">
          {{ item.type }}
        </label>
      </template>

      <template #[`item.amount`]="{ item }">
        {{ (item.amount || 0).toFixed(2) }} €
      </template>

      <template #[`item.to`]="{ item }">
        {{ getFullNameFromID(item.to) }}
      </template>

      <template #[`item.from`]="{ item }">
        {{ getFullNameFromID(item.from) }}
      </template>

      <template #[`item.created_at`]="{ item }">
        {{
          new Date(item.created_at).toLocaleString("fr", {
            timezone: "Europe/Paris",
          })
        }}
      </template>

      <template #[`item.action`]="{ item }">
        <v-btn icon small @click="deleteTransaction(item._id)">
          <v-icon small>mdi-trash-can</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script>
import SnackNotificationContainer from "./molecules/snackNotificationContainer";
const { safeCall } = require("../utils/api/calls");
import { RepoFactory } from "~/repositories/repoFactory";

export default {
  name: "OverTransactions",
  components: { SnackNotificationContainer },
  props: {
    transactions: {
      type: Array,
      default: () => [],
    },
    action: {
      type: Boolean,
      default: () => false,
    },
  },
  data: () => {
    return {
      headers: [
        { text: "Type", value: "type" },
        { text: "Depuis", value: "from" },
        {
          text: "Vers",
          value: "to",
        },
        { text: "Contexte", value: "context" },
        { text: "Date", value: "created_at" },
        {
          text: "Montant",
          value: "amount",
          align: "end",
        },
      ],
      users: {},
    };
  },
  async beforeMount() {
    const usersCall = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsernames(this)
    );
    if (usersCall) {
      usersCall.data.forEach((user) => {
        this.users[user.id] = user.username;
      });
      this.$forceUpdate();
    }
  },
  async mounted() {
    if (this.action) {
      this.headers.push({ text: "Action", value: "action" });
    }
  },
  methods: {
    async deleteTransaction(transactionID) {
      const deleteCall = await safeCall(
        this.$store,
        RepoFactory.transactionRepo.deleteTransaction(this, transactionID)
      );
      if (deleteCall) {
        // update on screen
        let mTransaction = this.transactions.find(
          (t) => t._id === transactionID
        );
        mTransaction.isValid = false;
        this.$accessor.notif.pushNotification({
          type: "success",
          message: "Tranasction supprimé",
        });
      }
    },
    getFullNameFromID(id) {
      return this.users[id];
    },
  },
};
</script>

<style scoped></style>
