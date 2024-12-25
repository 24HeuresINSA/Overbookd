<template>
  <DesktopPageTitle />
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
import type {
  ChartData,
  ChartOptions,
  ChartEvent,
  ActiveElement,
} from "chart.js";
import type { Statistics } from "@overbookd/http";
import { useTheme } from "vuetify";
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
  TEAM_QUERY_PARAM,
  findStatusByLabel,
  STATUS_QUERY_PARAM,
} from "~/utils/festival-event/festival-event.constant";
import {
  type FestivalEventStatus,
  isFestivalActivityStatus,
} from "~/utils/festival-event/festival-event.utils";
import {
  oldActivities,
  oldTasks,
} from "~/utils/festival-event/past-year.constant";
import { hexToRGBA } from "~/utils/hex-to-rgba.utils";
import { FA_URL, FT_URL } from "@overbookd/web-page";
import { CTMA_URL } from "~/utils/navigation/url.constant";

useHead({ title: "Statistiques des FA" });

const theme = useTheme();
const router = useRouter();

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

const handleChartClick = (_: ChartEvent, elements: ActiveElement[]) => {
  if (elements.length === 0) return;
  const datasetIndex = elements[0].datasetIndex;
  const index = elements[0].index;
  const teamCode = stats.value[index].teamCode;
  const statusLabel = datasets.value[datasetIndex].label;
  const status = findStatusByLabel(statusLabel);

  const path = displayTaskStats.value ? FT_URL : FA_URL;
  const teamQuery = { [TEAM_QUERY_PARAM]: teamCode };
  if (!status) {
    window.open(`${CTMA_URL}${path}?${new URLSearchParams(teamQuery)}`);
    return;
  }

  const statusQuery = { [STATUS_QUERY_PARAM]: status };
  router.push({ path, query: { ...teamQuery, ...statusQuery } });
};

const maxTotal = computed<number>(() =>
  Math.max(
    ...stats.value.map((stat) =>
      Object.values(stat.status).reduce((acc, curr) => acc + curr, 0),
    ),
    ...sortedOldEvents.value,
  ),
);
const options = computed<ChartOptions<"bar">>(() => {
  const textColor = theme.global.current.value.colors["on-surface"];
  const gridColor = hexToRGBA(textColor, 0.1);
  const scaleColors = {
    ticks: { color: textColor },
    grid: { color: gridColor },
  };

  return {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        min: 0,
        position: "bottom",
        ...scaleColors,
      },
      x1: {
        min: 0,
        position: "top",
        suggestedMax: maxTotal.value,
        ...scaleColors,
      },
      y: {
        stacked: true,
        ...scaleColors,
      },
    },
    plugins: {
      legend: {
        labels: { usePointStyle: true, color: textColor },
        onHover: (event: ChartEvent) => {
          (event?.native?.target as HTMLElement).style.cursor = "pointer";
        },
        onLeave: (event: ChartEvent) => {
          (event?.native?.target as HTMLElement).style.cursor = "default";
        },
      },
    },
    indexAxis: "y",
    onClick: handleChartClick,
    onHover: (event: ChartEvent, elements: ActiveElement[]) => {
      const target = event?.native?.target as HTMLElement;
      target.style.cursor = elements.length > 0 ? "pointer" : "default";
    },
  } as const;
});

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

const data = computed<ChartData<"bar">>(() => ({
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
