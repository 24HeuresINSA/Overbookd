<template>
  <v-data-table
    :headers="headers"
    :items="filteredTransactions"
    :items-per-page="200"
    density="compact"
    :loading="loading"
    loading-text="Chargement des transactions..."
    no-data-text="Aucune transaction trouvée"
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
        {{ shouldHavePayor(item) ? formatUsername(item.payor) : "" }}
      </span>
    </template>

    <template #item.to="{ item }">
      <span :class="{ deleted: item.isDeleted }">
        {{ shouldHavePayee(item) ? formatUsername(item.payee) : "" }}
      </span>
    </template>

    <template #item.context="{ item }">
      <span :class="{ deleted: item.isDeleted }">
        {{ item.context }}
      </span>
    </template>

    <template #item.createdAt="{ item }">
      <span :class="{ deleted: item.isDeleted }">
        {{ formatDateWithMinutes(item.createdAt) }}
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
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";
import {
  BARREL,
  DEPOSIT,
  PROVISIONS,
  TRANSFER,
  type TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { formatUsername } from "~/utils/user/user.utils";
import { formatDateWithMinutes } from "~/utils/date/date.utils";
import { SlugifyService } from "@overbookd/slugify";
import {
  matchingSearchItems,
  type Searchable,
} from "~/utils/search/search.utils";
import { VIREMENT, DEPOT, FUT, PLACARD } from "~/utils/transaction/transaction";

const transactionStore = useTransactionStore();

const transactions = computed<TransactionWithSenderAndReceiver[]>(() => {
  return transactionStore.allTransactions;
});

const loading = ref<boolean>(transactions.value.length === 0);
transactionStore.fetchAllTransactions().then(() => (loading.value = false));

const headers = [
  { title: "Type", value: "type" },
  { title: "Depuis", value: "from" },
  { title: "Vers", value: "to" },
  { title: "Contexte", value: "context" },
  { title: "Date", value: "createdAt" },
  { title: "Montant", value: "amount" },
  { title: "Supprimer", value: "delete" },
];

const search = ref<string>("");
const searchableTransactions = computed<
  Searchable<TransactionWithSenderAndReceiver>[]
>(() => {
  return transactions.value.map((transaction) => {
    const payor = shouldHavePayor(transaction)
      ? formatUsername(transaction.payor)
      : "";
    const payee = shouldHavePayee(transaction)
      ? formatUsername(transaction.payee)
      : "";
    return {
      ...transaction,
      searchable: SlugifyService.apply(
        `${payor} ${payee} ${transaction.type} ${transaction.amount} ${transaction.createdAt} ${transaction.context}`,
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
</style>
