<template>
  <v-data-table
    :headers="headers"
    :items="charismaPeriods"
    :items-per-page="-1"
    no-data-text="Aucun créneau ajouté"
    :loading="loading"
    loading-text="Chargement des créneaux..."
    :sort-by="[{ key: 'start' }]"
    density="compact"
    hide-default-footer
  >
    <template #item.start="{ item }">
      {{ formatDateWithMinutes(item.start) }}
    </template>
    <template #item.end="{ item }">
      {{ formatDateWithMinutes(item.end) }}
    </template>
    <template #item.actions="{ item }">
      <v-btn
        icon="mdi-pencil"
        size="small"
        variant="flat"
        @click="updateAvailability(item)"
      />
      <v-btn
        icon="mdi-trash-can"
        size="small"
        variant="flat"
        @click="deleteAvailability(item)"
      />
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { SavedCharismaPeriod } from "@overbookd/http";
import { formatDateWithMinutes } from "@overbookd/time";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const charismaPeriodStore = useCharismaPeriodStore();

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const headers: TableHeaders = [
  { title: "Nom", value: "name", sortable: true },
  { title: "Description", value: "description" },
  { title: "Début", value: "start", sortable: true },
  { title: "Fin", value: "end", sortable: true },
  { title: "Charisme/h", value: "charisma", sortable: true },
  { title: "Actions", value: "actions" },
];

const charismaPeriods = computed<SavedCharismaPeriod[]>(
  () => charismaPeriodStore.all,
);

const emit = defineEmits(["update", "delete"]);

const updateAvailability = (charismaPeriod: SavedCharismaPeriod) => {
  emit("update", charismaPeriod);
};
const deleteAvailability = (charismaPeriod: SavedCharismaPeriod) => {
  emit("delete", charismaPeriod);
};
</script>
