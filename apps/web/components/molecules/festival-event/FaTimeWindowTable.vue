<template>
  <div class="time-windows__listing">
    <v-data-table
      :headers="headers"
      :items="timeWindows"
      :items-per-page="-1"
      density="comfortable"
      :sort-by="[{ key: 'start' }]"
      no-data-text="Aucun créneau"
      :mobile="isMobile"
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
          @click="openUpdateTimeWindowDialog(item)"
        />
        <v-btn
          icon="mdi-trash-can"
          size="small"
          variant="flat"
          @click="removeTimeWindow(item)"
        />
      </template>
    </v-data-table>

    <v-btn
      v-show="!disabled"
      text="Ajouter un créneau"
      color="primary"
      class="time-windows__add"
      @click="openAddTimeWindowDialog"
    />

    <v-dialog v-model="isPeriodDialogOpen" max-width="600px">
      <CreatePeriodDialogCard
        :existing-period="selectedTimeWindow"
        @add="addTimeWindow"
        @update="updateTimeWindow"
        @close="closeDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { type IProvidePeriod, formatDateWithMinutes } from "@overbookd/time";
import type { TimeWindow } from "@overbookd/festival-event";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const layoutStore = useLayoutStore();

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
  const actionlHeader = { title: "Actions", value: "actions" };
  return props.disabled ? baseHeaders : [...baseHeaders, actionlHeader];
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const selectedTimeWindow = ref<TimeWindow | null>(null);
const isPeriodDialogOpen = ref<boolean>(false);
const openAddTimeWindowDialog = () => {
  selectedTimeWindow.value = null;
  isPeriodDialogOpen.value = true;
};
const openUpdateTimeWindowDialog = (timeWindow: TimeWindow) => {
  selectedTimeWindow.value = timeWindow;
  isPeriodDialogOpen.value = true;
};
const closeDialog = () => {
  selectedTimeWindow.value = null;
  isPeriodDialogOpen.value = false;
};

const emit = defineEmits(["add", "update", "remove"]);
const addTimeWindow = (period: IProvidePeriod) => emit("add", period);
const updateTimeWindow = (timeWindow: TimeWindow) => emit("update", timeWindow);
const removeTimeWindow = (timeWindow: TimeWindow) => emit("remove", timeWindow);
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
