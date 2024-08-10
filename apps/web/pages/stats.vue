<template>
  <h1 class="page-title">Statistiques 📈</h1>
  <v-card>
    <v-card-text>
      <div class="switch">
        <h2>FA</h2>
        <v-switch
          v-model="displayTaskStats"
          hide-details
          @update:model-value="updateTitle"
        />
        <h2>FT</h2>
      </div>
      <Bar :options="options" :data="data" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Bar } from "vue-chartjs";
import type { ChartEvent } from "chart.js";
import type { Statistics } from "@overbookd/http";
import type { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import {
  DRAFT,
  IN_REVIEW,
  REFUSED,
  VALIDATED,
  READY_TO_ASSIGN,
} from "@overbookd/festival-event-constants";
import {
  BROUILLON,
  RELECTURE_EN_COURS,
  REFUSEE,
  VALIDEE,
  PRETE_POUR_AFFECTATION,
} from "~/utils/festival-event/festival-event.constant";
import {
  type FestivalEventStatus,
  isFestivalActivityStatus,
} from "~/utils/festival-event/festival-event.utils";
import {
  oldActivities,
  oldTasks,
} from "~/utils/festival-event/past-year.constant";

useHead({ title: "Statistiques des FA" });

const displayTaskStats = ref<boolean>(false);

const updateTitle = (value: boolean | null) => {
  document.title = `Statistiques des ${value ? "FT" : "FA"}`;
};

const statsStore = useFestivalEventStatsStore();
const teamStore = useTeamStore();

statsStore.fetchActivityStats();
statsStore.fetchTaskStats();

const activityStats = computed<Statistics<FestivalActivity>[]>(
  () => statsStore.activityStats,
);
const taskStats = computed<Statistics<FestivalTask>[]>(
  () => statsStore.taskStats,
);
const stats = computed<Statistics[]>(() =>
  displayTaskStats.value ? taskStats.value : activityStats.value,
);

const labels = computed<string[]>(() => {
  const statsForLabel = displayTaskStats.value ? taskStats : activityStats;
  return statsForLabel.value.map(
    ({ teamCode }) => teamStore.getTeamByCode(teamCode)?.name ?? teamCode,
  );
});

const findByStatus = (status: FestivalEventStatus): number[] => {
  if (displayTaskStats.value) {
    return taskStats.value.map((stat) => stat.status[`${status}`]);
  }
  if (!isFestivalActivityStatus(status)) return [];
  return activityStats.value.map((stat) => stat.status[`${status}`]);
};

const sortedOldActivities = computed<number[]>(() =>
  activityStats.value.map(
    (stat) => oldActivities.get(stat.teamCode)?.valueOf() ?? 0,
  ),
);
const sortedOldTasks = computed<number[]>(() =>
  taskStats.value.map((stat) => oldTasks.get(stat.teamCode)?.valueOf() ?? 0),
);
const sortedOldEvents = computed<number[]>(() =>
  displayTaskStats.value ? sortedOldTasks.value : sortedOldActivities.value,
);

const maxTotal = computed<number>(() =>
  Math.max(
    ...stats.value.map((stat) =>
      Object.values(stat.status).reduce((acc, curr) => acc + curr, 0),
    ),
    ...sortedOldEvents.value,
  ),
);
const options = computed(
  () =>
    ({
      responsive: true,
      scales: {
        x: { stacked: true, min: 0, position: "bottom" },
        x1: { min: 0, position: "top", suggestedMax: maxTotal.value },
        y: { stacked: true },
      },
      plugins: {
        legend: {
          labels: { usePointStyle: true },
          onHover: (event: ChartEvent) => {
            (event?.native?.target as HTMLElement).style.cursor = "pointer";
          },
          onLeave: (event: ChartEvent) => {
            (event?.native?.target as HTMLElement).style.cursor = "default";
          },
        },
      },
      indexAxis: "y",
    }) as const,
);

const borderDatasetOptions = {
  borderRadius: 2,
  borderSkipped: false,
  borderWidth: 3,
};
const commonDatasets = computed(() => [
  {
    label: BROUILLON,
    data: findByStatus(DRAFT),
    borderColor: "grey",
    backgroundColor: "rgba(128, 128, 128, 0.6)",
    ...borderDatasetOptions,
  },
  {
    label: REFUSEE,
    data: findByStatus(REFUSED),
    borderColor: "red",
    backgroundColor: "rgba(255, 0, 0, 0.6)",
    ...borderDatasetOptions,
  },
  {
    label: RELECTURE_EN_COURS,
    data: findByStatus(IN_REVIEW),
    borderColor: "orange",
    backgroundColor: "rgba(255, 165, 0, 0.6)",
    ...borderDatasetOptions,
  },
  {
    label: VALIDEE,
    data: findByStatus(VALIDATED),
    borderColor: "green",
    backgroundColor: "rgba(0, 128, 0, 0.6)",
    ...borderDatasetOptions,
  },
]);
const additionalTaskDataset = computed(() => ({
  label: PRETE_POUR_AFFECTATION,
  data: findByStatus(READY_TO_ASSIGN),
  borderColor: "rgba(103, 58, 183)",
  backgroundColor: "rgba(103, 58, 183, 0.6)",
  ...borderDatasetOptions,
}));
const pastYearDataset = computed(() => ({
  type: "line" as never,
  label: "Validée à la 49ème",
  data: sortedOldEvents.value,
  borderColor: "blue",
  backgroundColor: "rgba(0, 0, 255, 0.6)",
  pointStyle: "crossRot",
  pointRadius: 8,
  borderWidth: 4,
  showLine: false,
  hitRadius: 10,
}));
const datasets = computed(() => {
  if (displayTaskStats.value) {
    return [
      ...commonDatasets.value,
      additionalTaskDataset.value,
      pastYearDataset.value,
    ];
  }
  return [...commonDatasets.value, pastYearDataset.value];
});

const data = computed(() => ({
  labels: labels.value,
  datasets: datasets.value,
}));
</script>

<style lang="scss" scoped>
.switch {
  display: flex;
  justify-content: center;
  align-items: center;
  h2 {
    margin: 0 1rem;
  }
}
</style>
