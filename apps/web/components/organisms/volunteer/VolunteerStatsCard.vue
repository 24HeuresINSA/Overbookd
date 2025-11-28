<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="displayedVolunteers"
      :loading="mergeLoading"
      loading-text="Chargement des bénévoles..."
      no-data-text="Aucun bénévole trouvé"
      :mobile="isMobile"
      density="compact"
      multi-sort
      hover
      @click:row="propagateClickedVolunteer"
    >
      <template #item.volunteer="{ item }">
        {{ item.firstname }} {{ item.lastname }}
      </template>

      <template
        v-for="category in displayableCategories"
        #[`item.${category}`]="{ item }"
      >
        {{ taskCategoryEmojis[category] }}
        {{ retrieveStat(item.stats, category) }}
      </template>

      <template #item.total="{ item }">
        {{ retrieveTotalDuration(item.stats) }}
      </template>

      <template #item.actions="{ item }">
        <v-btn
          icon="mdi-human-greeting"
          aria-label="Ouvrir en affect orga-tâche"
          title="Ouvrir en affect orga-tâche"
          size="small"
          variant="flat"
          @click.stop="openAssignmentPageInNewTab(item.id)"
        />
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import {
  BAR,
  FUN,
  MANUTENTION,
  RELOU,
  STATIQUE,
} from "@overbookd/festival-event-constants";
import type {
  AssignmentStat,
  VolunteerWithAssignmentStats,
} from "@overbookd/http";
import { Duration } from "@overbookd/time";
import type { UserPersonalData } from "@overbookd/user";
import { ASSIGNMENT_ORGA_TASK_URL } from "@overbookd/web-page";
import {
  AUCUNE,
  displayableCategories,
  taskCategoryEmojis,
  type DisplayableCategory,
} from "~/utils/assignment/task-category";
import {
  compareVolunteersOnNames,
  compareVolunteersOnTaskCategoryAssignmentDuration,
  compareVolunteersOnTotalAssignmentDuration,
  sumAssignmentDuration,
} from "~/utils/sort/sort-stats.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const props = defineProps({
  volunteers: {
    type: Array as PropType<UserPersonalData[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const headers: TableHeaders = [
  {
    title: "Bénévole",
    value: "volunteer",
    sortable: true,
    sortRaw: compareVolunteersOnNames,
  },
  { title: "Charisme", value: "charisma", sortable: true },
  {
    title: "Créneaux statiques",
    value: STATIQUE,
    sortable: true,
    sortRaw: compareVolunteersOnTaskCategoryAssignmentDuration(STATIQUE),
  },
  {
    title: "Créneaux bar",
    value: BAR,
    sortable: true,
    sortRaw: compareVolunteersOnTaskCategoryAssignmentDuration(BAR),
  },
  {
    title: "Créneaux manutention",
    value: MANUTENTION,
    sortable: true,
    sortRaw: compareVolunteersOnTaskCategoryAssignmentDuration(MANUTENTION),
  },
  {
    title: "Créneaux fun",
    value: FUN,
    sortable: true,
    sortRaw: compareVolunteersOnTaskCategoryAssignmentDuration(FUN),
  },
  {
    title: "Créneaux relous",
    value: RELOU,
    sortable: true,
    sortRaw: compareVolunteersOnTaskCategoryAssignmentDuration(RELOU),
  },
  {
    title: "Créneaux indéterminés",
    value: AUCUNE,
    sortable: true,
    sortRaw: compareVolunteersOnTaskCategoryAssignmentDuration(AUCUNE),
  },
  {
    title: "Totaux",
    value: "total",
    sortable: true,
    sortRaw: compareVolunteersOnTotalAssignmentDuration,
  },
  { title: "Actions", value: "actions" },
];

const userStore = useUserStore();
const layoutStore = useLayoutStore();

const isMobile = computed<boolean>(() => layoutStore.isMobile);

const emit = defineEmits(["click:volunteer"]);
const propagateClickedVolunteer = (
  _: MouseEvent,
  { item: { id } }: { item: VolunteerWithAssignmentStats },
) =>
  emit(
    "click:volunteer",
    props.volunteers.find((volunteer) => volunteer.id === id),
  );

const displayedVolunteers = computed<VolunteerWithAssignmentStats[]>(() => {
  const displayedVolunteersIds = new Set<number>(
    props.volunteers.map(({ id }) => id),
  );
  return userStore.volunteersWithAssignmentStats.filter(({ id }) =>
    displayedVolunteersIds.has(id),
  );
});

const assignmentStatsLoading = ref<boolean>(
  userStore.volunteersWithAssignmentStats.length === 0,
);
userStore
  .fetchVolunteersWithAssignmentStats()
  .then(() => (assignmentStatsLoading.value = false));

const mergeLoading = computed<boolean>(
  () => props.loading || assignmentStatsLoading.value,
);

const retrieveStat = (
  stats: AssignmentStat[],
  displayableCategory: DisplayableCategory,
) => {
  const categoryStat = stats.find(
    ({ category }) => (category ?? AUCUNE) === displayableCategory,
  );
  return Duration.ms(categoryStat?.duration ?? 0).toString();
};

const retrieveTotalDuration = (stats: AssignmentStat[]) =>
  sumAssignmentDuration(stats).toString();

const openAssignmentPageInNewTab = (id: number) => {
  window.open(`${ASSIGNMENT_ORGA_TASK_URL}?volunteer=${id}`);
};
</script>
