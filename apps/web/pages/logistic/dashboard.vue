<template class="dashboard">
  <DesktopPageTitle />

  <v-card>
    <v-card-text>
      <GearFilter
        v-model:search="filters.search"
        v-model:team="filters.team"
        v-model:category="filters.category"
        @update:options="searchGears"
      />
      <div class="dashboard__datepicker-export">
        <DateTimeField
          v-model="start"
          label="Début du créneau"
          @update:model-value="updateSelectedGear"
        />
        <DateTimeField
          v-model="end"
          label="Fin du créneau"
          @update:model-value="updateSelectedGear"
        />
        <v-btn
          text="Export"
          color="secondary"
          :loading="exportLoading"
          @click="exportCsv"
        />
      </div>
      <DashboardGearListing
        v-model:loading="loading"
        :start="start"
        :end="end"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { FilterGear } from "~/utils/logistic/filter-gear";
import { formatLocalDate, ONE_DAY_IN_MS } from "@overbookd/time";
import type { GearSearchOptions } from "@overbookd/http";
import { download } from "~/utils/file/download.utils";

useHead({ title: "Récap Matos" });

const dashboardStore = useLogisticDashboardStore();
const configurationStore = useConfigurationStore();

const filters = ref<FilterGear>({
  search: "",
  category: undefined,
  team: undefined,
});

const FOUR_DAYS_IN_MS = 4 * ONE_DAY_IN_MS;
const start = ref<Date>(configurationStore.eventStartDate);
const end = ref<Date>(new Date(start.value.getTime() + FOUR_DAYS_IN_MS));

const loading = ref<boolean>(dashboardStore.previews.length === 0);
const searchGears = (options: GearSearchOptions) => {
  dashboardStore.fetchPreviews(options).then(() => (loading.value = false));
};
searchGears({});

const updateSelectedGear = () => {
  if (dashboardStore.selectedGear === undefined) return;
  dashboardStore.fetchDetails(
    dashboardStore.selectedGear.slug,
    start.value,
    end.value,
  );
};

const exportLoading = ref<boolean>(false);
const exportCsv = async () => {
  exportLoading.value = true;
  await dashboardStore.fetchCSVRequirements();
  if (dashboardStore.csvRequirements) {
    const date = formatLocalDate(new Date());
    download(`recap-matos-${date}.csv`, dashboardStore.csvRequirements);
  }
  exportLoading.value = false;
};
</script>

<style lang="scss" scoped>
.dashboard {
  margin-left: auto;
  &__datepicker {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-top: 20px;
  }
}
</style>
