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
        {{
          item.type == "TRANSFER" || item.type == "DEPOSIT"
            ? getFullName(item.user_to)
            : ""
        }}
      </template>

      <template #[`item.from`]="{ item }">
        {{
          item.type == "TRANSFER" || item.type == "EXPENSE"
            ? getFullName(item.user_from)
            : ""
        }}
      </template>

      <template #[`item.created_at`]="{ item }">
        {{
          new Date(item.created_at).toLocaleString("fr", {
            timezone: "Europe/Paris",
          })
        }}
      </template>

      <template #[`item.action`]="{ item }">
        <v-btn
          v-if="!item.is_deleted"
          icon
          small
          @click="deleteTransaction(item.id)"
        >
          <v-icon small>mdi-trash-can</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script>
import SnackNotificationContainer from "./molecules/snack/SnackNotificationContainer.vue";
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
        this.$accessor.notif.pushNotification({
          type: "success",
          message: "Transaction supprimée",
        });
      }
      this.$accessor.notif.pushNotification({
        type: "error",
        message: "Une erreur est survenue",
      });
    },
    getFullName({ lastname, firstname }) {
      return `${firstname} ${lastname}`;
    },
  },
};
</script>

<style scoped></style>
