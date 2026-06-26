<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="meals"
      :loading="loading"
      loading-text="Chargement des repas..."
      no-data-text="Tu n'as participé à aucun repas partagé"
      :mobile="isMobile"
      hover
      return-object
      @click:row="propagateClickedMeal"
    >
      <template #item.createdAt="{ item }">
        {{ formatDateWithMinutes(item.createdAt) }}
      </template>

      <template #item.date="{ item }">
        <span class="meal-date">
          {{ item.meal.date }}
        </span>
      </template>

      <template #item.multiShotguns="{ item }">
        <v-icon
          v-if="item.areMultipleShotgunsAllowed"
          icon="mdi-check-circle"
          aria-label="Shotguns multiples autorisés"
          title="Shotguns multiples autorisés"
        />
      </template>

      <template #item.amount="{ item }">
        {{ Money.cents(item.expense.amount) }}
      </template>

      <template #item.closedAt="{ item }">
        {{ formatDateWithMinutes(item.closedAt) }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup lang="ts">
import { Money } from "@overbookd/money";
import type { PastSharedMeal } from "@overbookd/personal-account";
import { formatDateWithMinutes } from "@overbookd/time";
import type { TableHeaders } from "~/utils/vuetify/component-props";

defineProps({
  meals: {
    type: Array as PropType<PastSharedMeal[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const layoutStore = useLayoutStore();

const headers: TableHeaders = [
  { title: "Date de création", key: "createdAt", sortable: true },
  { title: "Date du repas", key: "date" },
  { title: "Chef", key: "chef.name", sortable: true },
  {
    title: "Nombre de portions",
    key: "portionCount",
    align: "center",
    sortable: true,
  },
  {
    title: "Nombre de convives",
    key: "shotguns.length",
    align: "center",
    sortable: true,
  },
  {
    title: "Shotgun multiples",
    key: "multiShotguns",
    align: "center",
    sortable: true, // TODO Sort
  },
  { title: "Coût total", key: "amount", sortable: true }, // TODO Sort
  { title: "Date de clôture", key: "closedAt", sortable: true },
];

const isMobile = computed<boolean>(() => layoutStore.isMobile);

const emit = defineEmits(["click:meal"]);
const propagateClickedMeal = (
  _: MouseEvent,
  { item }: { item: PastSharedMeal },
) => emit("click:meal", item);
</script>

<style lang="scss" scoped>
.meal-date {
  text-transform: capitalize;
}
</style>
