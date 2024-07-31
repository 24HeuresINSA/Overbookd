<template>
  <v-data-table
    :headers="headers"
    :items="filteredConsumers"
    class="consumer-table elevation-1"
    density="comfortable"
    items-per-page="20"
    :loading="loading"
    loading-text="Chargement des bénévoles..."
    no-data-text="Aucun bénévole"
    :sort-by="[{ key: 'firstname', order: 'asc' }]"
  >
    <template #top>
      <div class="consumer-table__filters">
        <v-btn-toggle v-model="teamFilter" color="primary" tile multiple>
          <v-btn :value="HARD_CODE"> Hard</v-btn>
          <v-btn :value="VIEUX_CODE"> Vieux </v-btn>
        </v-btn-toggle>
        <v-text-field
          v-model="searchConsumer"
          label="Rechercher un bénévole"
          hide-details
        />
      </div>
    </template>

    <template #item.firstname="{ item }">
      {{ buildUserNameWithNickname(item) }}
    </template>

    <template #item.balance="{ item }">
      <MoneyField v-model="item.balance" readonly hide-details hide-label />
    </template>

    <template #item.recap="{ item }">
      <MoneyField
        v-model="calculatedConsumption[item.id]"
        readonly
        hide-details
        hide-label
      />
    </template>

    <template #item.action="{ item }">
      <v-text-field
        v-if="isExpenseMode"
        v-model="item.newConsumption"
        label="Nombre de bâtons"
        :rules="[min(0), isInteger]"
        type="number"
        hide-details
        @update:model-value="updateNewConsumption(item, $event)"
      />
      <MoneyField
        v-else
        v-model="item.newConsumption"
        label="Moula"
        hide-details
        @update:model-value="updateNewConsumption(item, $event)"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import { HARD_CODE, VIEUX_CODE } from "@overbookd/team-constants";
import { buildUserNameWithNickname } from "@overbookd/user";
import { matchingSearchItems } from "~/utils/search/search.utils";
import type { ConsumerWithConsumption } from "~/utils/transaction/consumer";
import {
  type SgMode,
  CASK_MODE,
  CLOSET_MODE,
  DEPOSIT_MODE,
} from "~/utils/transaction/sg-mode";
import type { Searchable } from "~/utils/search/search.utils";
import { isNumber, min, isInteger } from "~/utils/rules/input.rules";
import { toSearchable } from "~/utils/search/search-user";
import type { TableHeaders } from "~/utils/data-table/header";

const consumers = defineModel<ConsumerWithConsumption[]>("consumers", {
  required: true,
});
const props = defineProps({
  mode: {
    type: String as PropType<SgMode>,
    required: true,
  },
  closetStickPrice: {
    type: Number,
    required: true,
  },
  caskStickPrice: {
    type: Number,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const headers = computed<TableHeaders>(() => {
  const recapTitle = isMode(DEPOSIT_MODE) ? "Nouveau dépôt" : "Nouvelle conso";
  return [
    { title: "Nom", value: "firstname", width: "30%", sortable: true },
    { title: "CP", value: "balance", width: "20%", sortable: true },
    {
      title: recapTitle,
      value: "recap",
      width: "20%",
      sortable: true,
    },
    { title: "Action", value: "action", width: "30%" },
  ];
});

const isMode = (value: SgMode) => props.mode === value;
const isExpenseMode = computed<boolean>(
  () => isMode(CASK_MODE) || isMode(CLOSET_MODE),
);

const existsOnlyOneConsumer = computed<boolean>(() => {
  return consumers.value.filter((c) => c.newConsumption > 0).length === 1;
});
const calculateSpentAmount = (consumption: number) => {
  if (isMode(CASK_MODE)) {
    const hasConsumption = consumption > 0;
    return hasConsumption && existsOnlyOneConsumer.value
      ? props.caskStickPrice
      : props.caskStickPrice * consumption;
  }
  if (isMode(CLOSET_MODE)) return props.closetStickPrice * consumption;
  return consumption;
};
const calculatedConsumption = computed<Record<number, number>>(() => {
  const result: Record<number, number> = {};
  consumers.value.forEach((consumer) => {
    result[consumer.id] = calculateSpentAmount(consumer.newConsumption);
  });
  return result;
});

const searchConsumer = ref<string>("");
const searchableConsumers = computed<Searchable<ConsumerWithConsumption>[]>(
  () => {
    return consumers.value.map(toSearchable);
  },
);

const teamFilter = ref<string[]>([HARD_CODE, VIEUX_CODE]);
const matchingTeamFilter = (consumerTeams: string[]) => {
  return teamFilter.value.some((team) => consumerTeams.includes(team));
};
const filteredConsumers = computed<ConsumerWithConsumption[]>(() => {
  const filteredByTeam = searchableConsumers.value.filter((consumer) =>
    matchingTeamFilter(consumer.teams),
  );
  return matchingSearchItems(filteredByTeam, searchConsumer.value);
});

const updateNewConsumption = (
  consumer: ConsumerWithConsumption,
  value: string | number,
) => {
  if (typeof value == "string" && !isNumber(value)) return;
  const consumerFromModel = consumers.value.find((c) => c.id === consumer.id);
  if (!consumerFromModel) return;
  const numberValue = Number(value);
  consumerFromModel.newConsumption = numberValue >= 0 ? numberValue : 0;
};
</script>

<style lang="scss" scoped>
.consumer-table {
  height: fit-content;
  &__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;
  }
}
</style>
