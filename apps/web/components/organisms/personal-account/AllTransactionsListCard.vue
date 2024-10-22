<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredTransactions"
        :items-per-page="200"
        density="compact"
        :loading="loading"
        loading-text="Chargement des transactions..."
        no-data-text="Aucune transaction trouvée"
        :mobile="isMobile"
      >
        <template #top>
          <v-text-field v-model="search" label="Rechercher une transaction" />
        </template>

        <template #item.type="{ item }">
          <span :class="{ deleted: item.isDeleted }">
            {{ displayableType(item.type) }}
          </span>
        </template>

        <template #item.from="{ item }">
          <span :class="{ deleted: item.isDeleted }">
            {{
              shouldHavePayor(item) ? formatTransactionUsername(item.payor) : ""
            }}
          </span>
        </template>

        <template #item.to="{ item }">
          <span :class="{ deleted: item.isDeleted }">
            {{
              shouldHavePayee(item) ? formatTransactionUsername(item.payee) : ""
            }}
          </span>
        </template>

        <template #item.context="{ item }">
          <span
            class="transaction__context"
            :class="{ deleted: item.isDeleted }"
          >
            {{ item.context }}
          </span>
        </template>

        <template #item.date="{ item }">
          <span :class="{ deleted: item.isDeleted }">
            {{ formatDateWithMinutes(item.date) }}
          </span>
        </template>

        <template #item.amount="{ item }">
          <span :class="{ deleted: item.isDeleted }">
            {{ convertToEuros(item.amount) }}
          </span>
        </template>

        <template #item.delete="{ item }">
          <v-btn
            v-if="!item.isDeleted"
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click="deleteTransaction(item)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import {
  BARREL,
  DEPOSIT,
  INITIALIZATION,
  PROVISIONS,
  SHARED_MEAL,
  TRANSFER,
  type TransactionUser,
  type TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { buildUserName } from "@overbookd/user";
import { formatDateWithMinutes } from "@overbookd/time";
import { SlugifyService } from "@overbookd/slugify";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import {
  VIREMENT,
  DEPOT,
  FUT,
  PLACARD,
  INITIALISATION,
  REPAS_PARTAGE,
} from "~/utils/transaction/transaction";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const transactionStore = useTransactionStore();
const layoutStore = useLayoutStore();

const transactions = computed<TransactionWithSenderAndReceiver[]>(() => {
  return transactionStore.allTransactions;
});

const loading = ref<boolean>(transactions.value.length === 0);
transactionStore.fetchAllTransactions().then(() => (loading.value = false));

const headers: TableHeaders = [
  { title: "Type", value: "type", sortable: true },
  { title: "Depuis", value: "from" },
  { title: "Vers", value: "to" },
  { title: "Contexte", value: "context" },
  { title: "Date", value: "date", sortable: true },
  { title: "Montant", value: "amount", sortable: true },
  { title: "Supprimer", value: "delete" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const formatTransactionUsername = (user?: TransactionUser) => {
  return user ? buildUserName(user) : "";
};

const search = ref<string>("");
const searchableTransactions = computed<
  Searchable<TransactionWithSenderAndReceiver>[]
>(() => {
  return transactions.value.map((transaction) => {
    const payor = shouldHavePayor(transaction)
      ? formatTransactionUsername(transaction.payor)
      : "";
    const payee = shouldHavePayee(transaction)
      ? formatTransactionUsername(transaction.payee)
      : "";
    return {
      ...transaction,
      searchable: SlugifyService.apply(
        `${payor} ${payee} ${transaction.type} ${transaction.amount} ${transaction.date} ${transaction.context}`,
      ),
    };
  });
});
const filteredTransactions = computed<TransactionWithSenderAndReceiver[]>(
  () => {
    return matchingSearchItems(searchableTransactions.value, search.value);
  },
);

const convertToEuros = (amount: number): string => {
  return Money.cents(amount).toString();
};
const shouldHavePayor = ({
  type,
}: TransactionWithSenderAndReceiver): boolean => {
  return type === TRANSFER || type === BARREL || type === PROVISIONS;
};
const shouldHavePayee = ({
  type,
}: TransactionWithSenderAndReceiver): boolean => {
  return type === TRANSFER || type === DEPOSIT;
};

const displayableType = (type: string): string => {
  switch (type) {
    case TRANSFER:
      return VIREMENT;
    case DEPOSIT:
      return DEPOT;
    case BARREL:
      return FUT;
    case PROVISIONS:
      return PLACARD;
    case SHARED_MEAL:
      return REPAS_PARTAGE;
    case INITIALIZATION:
      return INITIALISATION;
    default:
      return type;
  }
};

const deleteTransaction = (transaction: TransactionWithSenderAndReceiver) => {
  transactionStore.deleteTransaction(transaction);
};
</script>

<style lang="scss" scoped>
.deleted {
  color: red;
  text-decoration: line-through;
}

.transaction {
  &__context {
    word-break: break-word;
  }
}
</style>
