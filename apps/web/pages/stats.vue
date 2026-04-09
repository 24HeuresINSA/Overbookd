<template>
  <DesktopPageTitle />

  <v-card>
    <v-card-text>
      <div class="display-mode">
        <v-btn-toggle
          v-model="displayMode"
          color="primary"
          mandatory
          class="toggle"
          @update:model-value="updateStatsDisplayModeParam"
        >
          <v-btn
            :value="DISPLAY_FA"
            aria-label="FA"
            size="x-large"
            :rounded="false"
          >
            FA
          </v-btn>
          <v-btn
            :value="DISPLAY_FT"
            aria-label="FT"
            size="x-large"
            :rounded="false"
          >
            FT
          </v-btn>
        </v-btn-toggle>
      </div>

      <Bar :options="options" :data="data" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { FestivalActivity, FestivalTask } from "@overbookd/festival-event";
import {
  BROUILLON,
  DRAFT,
  IN_REVIEW,
  PRETE_POUR_AFFECTATION,
  READY_TO_ASSIGN,
  REFUSED,
  REFUSEE,
  RELECTURE_EN_COURS,
  VALIDATED,
  VALIDEE,
} from "@overbookd/festival-event-constants";
import type { Statistics } from "@overbookd/http";
import { READ_FA, READ_FT } from "@overbookd/permission";
import { FA_URL, FT_URL } from "@overbookd/web-page";
import type {
  ActiveElement,
  ChartData,
  ChartEvent,
  ChartOptions,
} from "chart.js";
import { Bar } from "vue-chartjs";
import { useTheme } from "vuetify";
import {
  findStatusByLabel,
  STATUS_QUERY_PARAM,
  TEAM_QUERY_PARAM,
} from "~/utils/festival-event/festival-event.constant";
import {
  isFestivalActivityStatus,
  type FestivalEventStatus,
} from "~/utils/festival-event/festival-event.utils";
import {
  oldActivities,
  oldTasks,
} from "~/utils/festival-event/past-year.constant";
import {
  DISPLAY_FA,
  DISPLAY_FT,
  StatsDisplayModeBuilder,
  type StatsDisplayMode,
} from "~/utils/festival-event/stats.display";
import { hexToRGBA } from "~/utils/hex-to-rgba.utils";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import { CTMA_URL } from "~/utils/navigation/url.constant";

useHead({ title: "Statistiques des FA" });

const theme = useTheme();
const router = useRouter();
const route = useRoute();

const statsStore = useFestivalEventStatsStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

const canReadFA = computed<boolean>(() => userStore.can(READ_FA));
const canReadFT = computed<boolean>(() => userStore.can(READ_FT));

const displayMode = ref<StatsDisplayMode>(DISPLAY_FA);
const isDisplayTasksMode = computed<boolean>(
  () => displayMode.value === DISPLAY_FT,
);

onMounted(() => {
  if (canReadFA.value) statsStore.fetchActivityStats();
  if (canReadFT.value) statsStore.fetchTaskStats();
  displayMode.value = StatsDisplayModeBuilder.getFromRouteQuery(route.query);
});

const updateStatsDisplayModeParam = (mode: StatsDisplayMode) => {
  document.title = `Statistiques des ${mode === DISPLAY_FT ? "FT" : "FA"}`;
  StatsDisplayModeBuilder.saveToStorage(mode);
  updateQueryParams("displayMode", mode);
};

const activityStats = computed<Statistics<FestivalActivity>[]>(
  () => statsStore.activityStats,
);
const taskStats = computed<Statistics<FestivalTask>[]>(
  () => statsStore.taskStats,
);
const stats = computed<Statistics[]>(() =>
  isDisplayTasksMode.value ? taskStats.value : activityStats.value,
);

const labels = computed<string[]>(() => {
  const statsForLabel = isDisplayTasksMode.value ? taskStats : activityStats;
  return statsForLabel.value.map(
    ({ teamCode }) => teamStore.getTeamByCode(teamCode)?.name ?? teamCode,
  );
});

const findByStatus = (status: FestivalEventStatus): number[] => {
  if (isDisplayTasksMode.value)
    return taskStats.value.map((stat) => stat.status[`${status}`]);

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
  isDisplayTasksMode.value ? sortedOldTasks.value : sortedOldActivities.value,
);

const handleChartClick = (event: ChartEvent, elements: ActiveElement[]) => {
  if (elements.length === 0 || event.type !== "click") return;

  const index = elements[0].index;
  const datasetIndex = elements[0].datasetIndex;
  const teamCode = stats.value[`${index}`].teamCode;
  const statusLabel = datasets.value[`${datasetIndex}`].label;
  const status = findStatusByLabel(statusLabel);

  redirectToFestivalEventsPage(event, teamCode, status);
};
const redirectToFestivalEventsPage = (
  event: ChartEvent,
  team: string,
  status?: FestivalActivity["status"] | FestivalTask["status"],
) => {
  const path = isDisplayTasksMode.value ? FT_URL : FA_URL;
  const teamQuery = { [TEAM_QUERY_PARAM]: team };
  const statusQuery = status ? { [STATUS_QUERY_PARAM]: status } : {};

  type EventWithKey = Event & { native?: { ctrlKey: boolean } };
  const shouldOpenInNewTab = (event as unknown as EventWithKey).native?.ctrlKey;

  if (!status) {
    const url = new URL(`${CTMA_URL}${path}`);
    url.searchParams.append(TEAM_QUERY_PARAM, team);
    window.open(url);
    return;
  }

  const route = { path, query: { ...teamQuery, ...statusQuery } };
  if (shouldOpenInNewTab) {
    const url = router.resolve(route);
    window.open(url.href);
    return;
  }
  router.push(route);
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

  return {
    responsive: true,
    scales: {
      x: {
        stacked: true,
        min: 0,
        position: "bottom",
        suggestedMax: maxTotal.value,
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      x1: {
        min: 0,
        position: "top",
        suggestedMax: maxTotal.value,
        ticks: { color: textColor },
        grid: { color: gridColor },
      },
      y: {
        stacked: true,
        ticks: { autoSkip: false, color: textColor },
        grid: { color: gridColor },
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
  label: "Validée à la 50ème",
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
  if (isDisplayTasksMode.value)
    return [
      ...commonDatasets.value,
      additionalTaskDataset.value,
      pastYearDataset.value,
    ];

  return [...commonDatasets.value, pastYearDataset.value];
});

const data = computed<ChartData<"bar">>(() => ({
  labels: labels.value,
  datasets: datasets.value,
}));
</script>

<style scoped>
.display-mode {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;

  .toggle {
    border: 1px solid rgba(var(--v-border-color), 0.3);
  }
}
</style>
