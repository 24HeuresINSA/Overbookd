<template>
  <div class="supplies__listing">
    <v-data-table
      :headers="headers"
      :items="supplies"
      :items-per-page="-1"
      disable-pagination
      hide-default-footer
      no-data-text="Aucun besoin en électricité"
    >
      <template #item.connection="{ item }">
        {{ getConnectionLabel(item.connection) }}
      </template>
      <template #item.power="{ item }"> {{ item.power }} W </template>
      <template #item.actions="{ item }">
        <div class="supplies__actions">
          <v-btn
            icon="mdi-pencil"
            density="comfortable"
            @click="openUpdateSupplyDialog(item)"
          />
          <v-btn
            icon="mdi-trash-can"
            density="comfortable"
            @click="removeSupply(item)"
          />
        </div>
      </template>
    </v-data-table>

    <v-btn
      text="Ajouter un besoin en électricité"
      color="primary"
      class="supplies__add"
      @click="openAddSupplyDialog"
    />

    <v-dialog v-model="isSupplyDialogOpen" max-width="600">
      <ElectricitySupplyFormDialogCard
        :supply="selectedSupply"
        @add="addSupply"
        @update="updateSupply"
        @close="closeDialog"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {
  ElectricitySupply,
  ElectricityConnection,
  PrepareElectricitySupplyCreation,
} from "@overbookd/festival-event";
import { electricityConnectionLabels } from "~/utils/festival-event/festival-activity/festival-activity.model";
import type { TableHeaders } from "~/utils/data-table/header";

const props = defineProps({
  supplies: {
    type: Array as PropType<ElectricitySupply[]>,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const headers = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Type de raccordement", value: "connection", sortable: true },
    { title: "Appareil", value: "device", sortable: true },
    { title: "Puissance par appareil", value: "power", sortable: true },
    { title: "Nombre", value: "count", sortable: true },
    { title: "Commentaire", value: "comment" },
  ];
  const actionsHeader = { title: "Actions", value: "actions" };
  return props.disabled ? baseHeaders : [...baseHeaders, actionsHeader];
});

const selectedSupply = ref<ElectricitySupply | null>(null);
const isSupplyDialogOpen = ref<boolean>(false);
const openAddSupplyDialog = () => {
  selectedSupply.value = null;
  isSupplyDialogOpen.value = true;
};
const openUpdateSupplyDialog = (supply: ElectricitySupply) => {
  selectedSupply.value = supply;
  isSupplyDialogOpen.value = true;
};
const closeDialog = () => {
  isSupplyDialogOpen.value = false;
  selectedSupply.value = null;
};

const getConnectionLabel = (connection: ElectricityConnection): string => {
  return electricityConnectionLabels.get(connection) ?? "";
};

const emit = defineEmits(["add", "update", "remove"]);
const addSupply = (supply: PrepareElectricitySupplyCreation) => {
  emit("add", supply);
};
const updateSupply = (supply: ElectricitySupply) => emit("update", supply);
const removeSupply = (supply: ElectricitySupply) => emit("remove", supply);
</script>

<style lang="scss" scoped>
.supplies {
  &__listing {
    display: flex;
    flex-direction: column;
    gap: 0.5em;
    margin-bottom: 20px;
  }
  &__add {
    max-width: fit-content;
    align-self: flex-end;
  }
  &__actions {
    display: flex;
    gap: 10px;
  }
}
</style>
