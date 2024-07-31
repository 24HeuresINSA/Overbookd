<template>
  <div class="time-windows__listing">
    <v-data-table
      :headers="headers"
      :items="timeWindows"
      :items-per-page="-1"
      hide-default-footer
      density="comfortable"
      :sort-by="[{ key: 'start' }]"
      no-data-text="Aucun créneau"
    >
      <template #item.start="{ item }">
        {{ formatDateWithMinutes(item.start) }}
      </template>

      <template #item.end="{ item }">
        {{ formatDateWithMinutes(item.end) }}
      </template>

      <template #item.removal="{ item }">
        <v-btn
          icon="mdi-trash-can"
          density="comfortable"
          @click="removeTimeWindow(item)"
        />
      </template>
    </v-data-table>

    <v-btn
      v-show="!disabled"
      text="Ajouter un créneau"
      color="primary"
      class="time-windows__add"
      @click="openAddDialog"
    />

    <v-dialog v-model="isAddDialogOpen" max-width="600px">
      <CreatePeriodDialogCard @add="addTimeWindow" @close="closeAddDialog" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { formatDateWithMinutes } from "@overbookd/date";
import type { TimeWindow } from "@overbookd/festival-event";
import type { IProvidePeriod } from "@overbookd/period";
import type { TableHeaders } from "~/utils/data-table/header";

const props = defineProps({
  timeWindows: {
    type: Array as PropType<TimeWindow[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const headers = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Date de début", value: "start", sortable: true },
    { title: "Date de fin", value: "end", sortable: true },
  ];
  const removalHeader = { title: "Suppression", value: "removal" };
  return props.disabled ? baseHeaders : [...baseHeaders, removalHeader];
});

const emit = defineEmits(["add", "remove"]);
const addTimeWindow = (period: IProvidePeriod) => emit("add", period);
const removeTimeWindow = (timeWindow: TimeWindow) => emit("remove", timeWindow);

const isAddDialogOpen = ref<boolean>(false);
const openAddDialog = () => (isAddDialogOpen.value = true);
const closeAddDialog = () => (isAddDialogOpen.value = false);
</script>

<style lang="scss" scoped>
.time-windows {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 5px;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
}
</style>
