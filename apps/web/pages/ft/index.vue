<template>
  <h1>Fiches Tâches</h1>
  <div class="task ft">
    <FtFilter v-model="filters" class="task__filtering" />
    <v-card class="task__listing">
      <v-data-table
        :headers="tableHeaders"
        :items="filteredTasks"
        :items-per-page="20"
        class="task__table"
        :loading="loading"
        loading-text="Chargement des fiches tâches..."
        no-data-text="Aucune fiche tâche trouvée"
        :hover="filteredTasks.length > 0"
        @click:row="openTask"
        @auxclick:row="openTaskInNewTab"
      >
        <template #item.id="{ item }">
          <v-chip-group id="status">
            <v-chip :class="item.status.toLowerCase()">
              {{ item.id }}
            </v-chip>
          </v-chip-group>
        </template>

        <template #item.reviews="{ item }">
          <v-chip-group id="reviewers" column>
            <v-chip
              v-for="reviewer of reviewers"
              :key="reviewer.code"
              :class="getReviewerStatus(item, reviewer)"
              size="small"
            >
              <v-icon size="small"> {{ reviewer.icon }} </v-icon>
            </v-chip>
          </v-chip-group>
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
        </template>

        <template #item.administrator="{ item }">
          {{ formatUsername(item.administrator) }}
        </template>

        <template #item.removal="{ item }">
          <v-btn
            icon="mdi-delete"
            size="small"
            @click.stop="openRemovalDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card>
  </div>

  <v-btn
    icon="mdi-plus-thick"
    size="large"
    color="primary"
    class="btn-plus"
    @click="openNewTaskDialog"
  />

  <v-dialog v-model="isNewTaskDialogOpen" width="600">
    <CreateFtDialogCard @close="closeNewTaskDialog" />
  </v-dialog>

  <v-dialog v-model="isRemovalDialogOpen" max-width="600">
    <ConfirmationDialogCard
      confirm-color="error"
      @close="closeRemovalDialog"
      @confirm="removeTask"
    >
      <template #title>
        Suppression de la FT #<strong>
          {{ taskToRemove?.id }}
        </strong>
      </template>
      <template #statement>
        Tu es sur le point de supprimer la FT
        <strong>{{ taskToRemove?.name }}.</strong>
        Es-tu sûr de faire ça ?
      </template>
      <template #confirm-btn-content>
        <v-icon left> mdi-delete </v-icon>Supprimer
      </template>
    </ConfirmationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type {
  PreviewFestivalTask,
  FestivalTask,
  Reviewer,
} from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { WRITE_FT } from "@overbookd/permission";
import { SlugifyService } from "@overbookd/slugify";
import type { User } from "@overbookd/user";
import type { Searchable } from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/data-table/header";
import { formatUsername } from "~/utils/user/user.utils";
import { isDraftPreview } from "~/utils/festival-event/festival-task/festival-task.model";
import { findReviewStatus } from "~/utils/festival-event/festival-event.utils";
import { openTask, openTaskInNewTab } from "~/utils/festival-event/open-page";
import {
  type TaskFilters,
  type TaskReviewsFilter,
  TaskFilterBuilder,
} from "~/utils/festival-event/festival-task/festival-task.filter";
import { getPreviewReviewStatus } from "~/utils/festival-event/festival-task/festival-task.utils";

useHead({ title: "Fiches Tâches" });

const route = useRoute();
const ftStore = useFestivalTaskStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

const canRemoveTask = computed<boolean>(() => userStore.can(WRITE_FT));
const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Statut", value: "id", sortable: true },
    { title: "Validations", value: "reviews" },
    { title: "Nom", value: "name", sortable: true },
    { title: "Equipe", value: "team", sortable: true },
    { title: "Gestionnaire", value: "administrator" },
  ];
  const removalHeader = { title: "Suppression", value: "removal" };
  return canRemoveTask.value ? [...baseHeaders, removalHeader] : baseHeaders;
});

const tasks = computed<PreviewFestivalTask[]>(() => ftStore.tasks.forAll);
const reviewers = computed<Team[]>(() => teamStore.ftReviewers);

teamStore.fetchFtReviewers();
const loading = ref<boolean>(tasks.value.length === 0);
ftStore.fetchAllTasks().then(() => (loading.value = false));

const isNewTaskDialogOpen = ref<boolean>(false);
const openNewTaskDialog = () => (isNewTaskDialogOpen.value = true);
const closeNewTaskDialog = () => (isNewTaskDialogOpen.value = false);

const taskToRemove = ref<PreviewFestivalTask | undefined>(undefined);
const isRemovalDialogOpen = ref<boolean>(false);
const openRemovalDialog = (task: PreviewFestivalTask) => {
  taskToRemove.value = task;
  isRemovalDialogOpen.value = true;
};
const closeRemovalDialog = () => {
  isRemovalDialogOpen.value = false;
  taskToRemove.value = undefined;
};
const removeTask = () => {
  if (!taskToRemove.value) return;
  ftStore.remove(taskToRemove.value.id);
};

const getReviewerStatus = (task: PreviewFestivalTask, reviewer: Team) => {
  if (isDraftPreview(task)) return "";
  const reviewerCode = reviewer.code as Reviewer<"FT">;
  const status = task.reviews[`${reviewerCode}`];
  return (findReviewStatus(status) ?? "").toLowerCase();
};

const filters = ref<TaskFilters>({});
onMounted(
  () => (filters.value = TaskFilterBuilder.getFromRouteQuery(route.query)),
);

const searchableTasks = computed<Searchable<PreviewFestivalTask>[]>(() =>
  tasks.value.map((ft) => ({
    ...ft,
    searchable: SlugifyService.apply(`${ft.id} ${ft.name}`),
  })),
);
const filterTaskByTeam =
  (teamSearched?: Team) =>
  ({ team }: PreviewFestivalTask) => {
    return teamSearched ? team === teamSearched.code : true;
  };
const filterTaskByAdministrator =
  (adherentSearched?: User) =>
  ({ administrator }: PreviewFestivalTask) => {
    return adherentSearched ? administrator.id === adherentSearched.id : true;
  };
const filterTaskByStatus =
  (statusSearched?: FestivalTask["status"]) =>
  ({ status }: PreviewFestivalTask) => {
    return statusSearched ? status === statusSearched : true;
  };
const filterTaskByNameAndId =
  (search?: string) =>
  ({ searchable }: Searchable<PreviewFestivalTask>) => {
    const slugifiedSearch = SlugifyService.apply(search ?? "");
    return searchable.includes(slugifiedSearch);
  };
const filterTaskByReviews =
  (reviews: TaskReviewsFilter) => (task: Searchable<PreviewFestivalTask>) => {
    const reviewersWithStatus = Object.entries(reviews).filter(
      ([, status]) => status !== undefined,
    );
    const reviewsAreEmpty = reviewersWithStatus.length === 0;
    if (reviewsAreEmpty) return true;

    if (isDraftPreview(task)) return false;
    return reviewersWithStatus.every(
      ([reviewer, status]) => getPreviewReviewStatus(task, reviewer) === status,
    );
  };
const filterTaskByReviewer =
  (adherentSearched?: User) => (task: PreviewFestivalTask) => {
    if (isDraftPreview(task)) return false;
    return adherentSearched ? task.reviewer.id === adherentSearched.id : true;
  };
const filteredTasks = computed<PreviewFestivalTask[]>(() => {
  const { team, status, search, adherent, reviewer, ...reviews } =
    filters.value;

  return searchableTasks.value.filter((task) => {
    return (
      filterTaskByTeam(team)(task) &&
      filterTaskByAdministrator(adherent)(task) &&
      filterTaskByStatus(status)(task) &&
      filterTaskByNameAndId(search)(task) &&
      filterTaskByReviews(reviews)(task) &&
      filterTaskByReviewer(reviewer)(task)
    );
  });
});
</script>

<style lang="scss" scoped>
.task {
  display: flex;
  padding: 10px 30px 10px 10px;
  gap: 15px;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    padding: 10px;
  }
  &__listing {
    margin-left: 20px;
    margin-bottom: 40px;
    height: fit-content;
    width: 100vw;
    flex-grow: 3;
  }
  &__filtering {
    flex-grow: 1;
    min-width: 300px;
  }
  #status {
    font-weight: bold;
  }
}

.btn-plus {
  right: 20px;
  bottom: 45px;
  position: fixed;
  @media screen and (max-width: $mobile-max-width) {
    bottom: 70px;
  }
}

@media only screen and (max-width: $mobile-max-width) {
  .task {
    &__listing {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
