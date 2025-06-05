<template>
  <div>
    <v-data-table
      v-model:expanded="displayedGears"
      :items="previews"
      :headers="headers"
      item-value="slug"
      :loading="loading"
      loading-text="Chargement du matos..."
      no-data-text="Aucun matos"
      show-expand
      expand-on-click
      @update:expanded="expandOnIconClick"
    >
      <template #item.isConsumable="{ item }">
        <div v-show="item.isConsumable" class="icon">
          <v-icon size="24"> mdi-delete-empty-outline </v-icon>
          <span class="icon-detail">Consommable</span>
        </div>
      </template>
      <template #expanded-row>
        <td :colspan="headers.length">
          <DashboardGearDetailsGraph @select:gear-details="selectGearDetails" />
        </td>
      </template>
    </v-data-table>

    <v-dialog v-model="isGearDetailsOpen" max-width="800">
      <DashboardGearDetailsDialogCard
        v-if="selectedGearDetails"
        :gear-details="selectedGearDetails"
        @close="closeGearDetails"
      />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import type {
  GearDetails,
  GearPreview,
  GearWithDetails,
} from "@overbookd/http";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const dashboardStore = useLogisticDashboardStore();

const props = defineProps({
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const headers: TableHeaders = [
  { title: "Matos", value: "name", sortable: true },
  {
    title: "Différence minimum entre le stock et les demandes",
    value: "stockDiscrepancy",
    sortable: true,
  },
  { title: "Matos consommable", value: "isConsumable", sortable: true },
];

type GearDetailsWithName = GearDetails & { name: string };
const selectedGearDetails = ref<GearDetailsWithName | undefined>();

const previews = computed<GearPreview[]>(() => dashboardStore.previews);
const displayedGears = ref<string[]>([]);

const expandOnIconClick = async (gears: string[]) => {
  if (gears.length === 0) return;
  const lastSlug = gears[gears.length - 1];
  if (gears.length > 1) displayedGears.value = [lastSlug];
  await dashboardStore.fetchDetails(lastSlug, props.start, props.end);
};

const selectedGear = computed<GearWithDetails | undefined>(
  () => dashboardStore.selectedGear,
);
const isGearDetailsOpen = ref<boolean>(false);
const selectGearDetails = (index: number) => {
  if (!selectedGear.value) return;
  const details = selectedGear.value.details.at(index);
  if (!details) return;

  selectedGearDetails.value = { ...details, name: selectedGear.value.name };
  isGearDetailsOpen.value = true;
};
const closeGearDetails = () => {
  isGearDetailsOpen.value = false;
  selectedGearDetails.value = undefined;
};
</script>

<style lang="scss" scoped>
.icon {
  position: relative;
  display: inline-block;
  .icon-detail {
    visibility: hidden;
    font-size: 0.8rem;
    text-align: center;
    user-select: none;
    z-index: 1;
    opacity: 0.75;
    @media screen and (max-width: $mobile-max-width) {
      display: none;
    }
  }
}
.icon:hover .icon-detail {
  visibility: visible;
}
</style>
