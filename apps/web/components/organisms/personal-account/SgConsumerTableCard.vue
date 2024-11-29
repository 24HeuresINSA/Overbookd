<template>
  <v-card>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="filteredConsumers"
        class="consumer-table"
        density="comfortable"
        :loading="loading"
        loading-text="Chargement des bénévoles..."
        no-data-text="Aucun bénévole"
        :sort-by="[{ key: 'firstname', order: 'asc' }]"
        :mobile="isMobile"
      >
        <template #top>
          <div class="consumer-table__filters">
            <v-btn-toggle
              v-model="teamFilter"
              color="primary"
              class="team-filter"
              tile
              multiple
            >
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
          <MoneyField
            v-model="item.balance"
            density="compact"
            readonly
            hide-details
            hide-label
          />
        </template>

        <template #item.recap="{ item }">
          <MoneyField
            v-model="computedFinalAmounts[item.id]"
            density="compact"
            readonly
            hide-details
            hide-label
          />
        </template>

        <template #item.action="{ item }">
          <div v-if="isExpenseMode" class="expense-fields-inline">
            <v-text-field
              v-model="item.amount"
              :rules="[min(0), isInteger]"
              density="compact"
              type="number"
              hide-details
              @update:model-value="updateAmount(item, $event)"
            />
            <v-btn
              text="+1"
              color="primary"
              density="comfortable"
              rounded="l"
              variant="outlined"
              min-width="0"
              class="increase-button"
              @click="addToConsumption(item, 1)"
            />
            <v-btn
              text="+5"
              color="primary"
              density="comfortable"
              rounded="l"
              variant="outlined"
              min-width="0"
              class="increase-button"
              @click="addToConsumption(item, 5)"
            />
          </div>

          <MoneyField
            v-else
            v-model="item.amount"
            density="compact"
            hide-details
            hide-label
            @update:model-value="updateAmount(item, $event)"
          />
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { HARD_CODE, VIEUX_CODE } from "@overbookd/team-constants";
import { buildUserNameWithNickname } from "@overbookd/user";
import { matchingSearchItems } from "~/utils/search/search.utils";
import type { ConsumerWithAmount } from "~/utils/transaction/consumer";
import {
  type SgMode,
  CASK_MODE,
  CLOSET_MODE,
  DEPOSIT_MODE,
  EXTERNAL_EVENT_MODE,
} from "~/utils/transaction/sg-mode";
import type { Searchable } from "~/utils/search/search.utils";
import { isNumber, min, isInteger } from "~/utils/rules/input.rules";
import { toSearchable } from "~/utils/search/searchable-user.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const layoutStore = useLayoutStore();

const consumers = defineModel<ConsumerWithAmount[]>("consumers", {
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
  const actionTitle =
    isMode(DEPOSIT_MODE) || isMode(EXTERNAL_EVENT_MODE)
      ? "Moula"
      : "Nombre de bâtons";
  return [
    { title: "Nom", value: "firstname", width: "30%", sortable: true },
    { title: "CP", value: "balance", width: "20%", sortable: true },
    {
      title: recapTitle,
      value: "recap",
      width: "20%",
      sortable: true,
    },
    { title: actionTitle, value: "action", width: "30%" },
  ];
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const isMode = (value: SgMode) => props.mode === value;
const isExpenseMode = computed<boolean>(
  () => isMode(CASK_MODE) || isMode(CLOSET_MODE),
);

const existsOnlyOneConsumer = computed<boolean>(() => {
  return consumers.value.filter((c) => c.amount > 0).length === 1;
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
const computedFinalAmounts = computed<Record<number, number>>(() =>
  consumers.value.reduce((result, consumer) => {
    result[consumer.id] = calculateSpentAmount(consumer.amount);
    return result;
  }, {}),
);

const searchConsumer = ref<string>("");
const searchableConsumers = computed<Searchable<ConsumerWithAmount>[]>(() =>
  consumers.value.map(toSearchable),
);

const teamFilter = ref<string[]>([HARD_CODE, VIEUX_CODE]);
const matchingTeamFilter = (consumerTeams: string[]) => {
  return teamFilter.value.some((team) => consumerTeams.includes(team));
};
const filteredConsumers = computed<ConsumerWithAmount[]>(() => {
  const filteredByTeam = searchableConsumers.value.filter((consumer) =>
    matchingTeamFilter(consumer.teams),
  );
  return matchingSearchItems(filteredByTeam, searchConsumer.value);
});

const updateAmount = (consumer: ConsumerWithAmount, value: string | number) => {
  if (typeof value == "string" && !isNumber(value)) return;
  const consumerFromModel = consumers.value.find((c) => c.id === consumer.id);
  if (!consumerFromModel) return;
  const numberValue = Number(value);
  consumerFromModel.amount = numberValue >= 0 ? numberValue : 0;
};

const addToConsumption = (consumer: ConsumerWithAmount, value: number) => {
  const consumerFromModel = consumers.value.find((c) => c.id === consumer.id);
  if (!consumerFromModel) return;
  consumerFromModel.amount += value;
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

  .team-filter {
    display: flex;
    gap: 5px;
  }
}

.expense-fields-inline {
  display: flex;
  column-gap: 0.8em;
  align-items: center;
}

.v-text-field {
  min-width: 60px;
}

.increase-button {
  padding: 0 10px !important;
}
</style>
