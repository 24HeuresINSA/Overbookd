<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="transactions"
      dense
      :items-per-page="-1"
    >
      <template #group.summary="{ group }">
        {{ new Date(group).toLocaleString() }}
      </template>

      <template #item.type="{ item }">
        <label :style="item.isDeleted ? 'background-color: red' : ''">
          {{ item.type }}
        </label>
      </template>

      <template #item.amount="{ item }">
        {{ convertToEuros(item.amount) }}
      </template>

      <template #item.to="{ item }">
        {{
          item.type == "TRANSFER" || item.type == "DEPOSIT"
            ? getFullName(item.userTo)
            : ""
        }}
      </template>

      <template #item.from="{ item }">
        {{
          item.type == "TRANSFER" ||
          item.type == "BARREL" ||
          item.type == "PROVISIONS"
            ? getFullName(item.userFrom)
            : ""
        }}
      </template>

      <template #item.createdAt="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #item.action="{ item }">
        <v-btn
          v-if="!item.isDeleted"
          icon
          small
          @click="deleteTransaction(item.id)"
        >
          <v-icon small>mdi-trash-can</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <SnackNotificationContainer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import { RepoFactory } from "~/repositories/repo-factory";
import { safeCall } from "~/utils/api/calls";
import { Money } from "~/utils/money/money";
import { formatUsername } from "~/utils/user/user.utils";
import { User } from "@overbookd/user";
import { formatDateWithMinutes } from "~/utils/date/date.utils";

export default defineComponent({
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
        { text: "Vers", value: "to" },
        { text: "Contexte", value: "context" },
        { text: "Date", value: "createdAt" },
        { text: "Montant", value: "amount" },
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
    async deleteTransaction(transactionId: string) {
      const deleteCall = await safeCall(
        this.$store,
        RepoFactory.TransactionRepository.deleteTransaction(
          this,
          transactionId,
        ),
      );
      if (deleteCall) {
        // update on screen
        this.$accessor.notif.pushNotification({
          message: "Transaction supprimée",
        });
      }
      this.$accessor.notif.pushNotification({
        message: "Une erreur est survenue",
      });
    },
    getFullName(user: User): string {
      return formatUsername(user);
    },
    convertToEuros(amount: number): string {
      return Money.displayCents(amount);
    },
    formatDate(date: Date): string {
      return formatDateWithMinutes(date);
    },
  },
});
</script>
