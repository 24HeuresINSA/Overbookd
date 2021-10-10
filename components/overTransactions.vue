<template>
  <v-data-table
    :headers="headers"
    :items="transactions"
    dense
    :items-per-page="-1"
    sort-by="createdAt"
  >
    <template #[`group.summary`]="{ group }">
      {{ new Date(group).toLocaleString() }}
    </template>

    <template #[`item.type`]="{ item }">
      <label
        v-if="item.isValid === false"
        style="text-decoration: line-through"
      >
        {{ item.type }}
      </label>
      <label v-else>
        {{ item.type }}
      </label>
    </template>

    <template #[`item.amount`]="{ item }">
      {{ (item.amount || 0).toFixed(2) }} €
    </template>

    <template #[`item.to`]="{ item }">
      {{ getFullNameFromKeycloakID(item.to) }}
    </template>

    <template #[`item.from`]="{ item }">
      {{ getFullNameFromKeycloakID(item.from) }}
    </template>

    <template #[`item.createdAt`]="{ item }">
      {{ new Date(item.createdAt).toLocaleString() }}
    </template>

    <template #[`item.action`]="{ item }">
      <v-btn icon small @click="deleteTransaction(item._id)">
        <v-icon small>mdi-trash-can</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
const { safeCall } = require("../utils/api/calls");
import { RepoFactory } from "~/repositories/repoFactory";

export default {
  name: "OverTransactions",
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
        { text: "type", value: "type" },
        { text: "depuis", value: "from" },
        {
          text: "vers",
          value: "to",
        },
        { text: "context", value: "context" },
        { text: "date", value: "createdAt" },
        {
          text: "montant",
          value: "amount",
          align: "end",
        },
      ],
      users: {},
    };
  },
  async beforeMount() {
    if (this.action) {
      this.headers.push({ text: "action", value: "action" });
    }
    const usersCall = await safeCall(
      this.$store,
      RepoFactory.userRepo.getAllUsernames(this)
    );
    if (usersCall) {
      usersCall.data.forEach((user) => {
        this.users[user.keycloakID] = user.username;
      });
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
        let mTransactions = this.transactions.find(
          (t) => t._id !== transactionID
        );
        mTransactions.isValid = false;
      }
    },
    getFullNameFromKeycloakID(keycloakID) {
      return this.users[keycloakID];
    },
  },
};
</script>

<style scoped></style>
