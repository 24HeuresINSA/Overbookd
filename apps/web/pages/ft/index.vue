<template>
  <DesktopPageTitle />
  <div class="quick-filters">
    <nuxt-link :to="`${FT_URL}?adherent=${me?.id}`">
      <v-btn text="Mes FTs" variant="outlined" color="primary" />
    </nuxt-link>
  </div>
  <main class="task ft">
    <FtFilter v-model="filters" class="task__filtering" />
    <v-card class="task__listing">
      <v-data-table
        :headers="tableHeaders"
        :items="filteredTasks"
        class="task__table"
        :loading="loading"
        loading-text="Chargement des fiches tâches..."
        no-data-text="Aucune fiche tâche trouvée"
        :items-per-page="filters.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE"
        :hover="filteredTasks.length > 0"
        :mobile="isMobile"
        @click:row="openTask"
        @auxclick:row="openTaskInNewTab"
        @update:items-per-page="updateItemsPerPage"
      >
        <template #item.id="{ item }">
          <v-chip-group id="status">
            <v-chip :class="item.status.toLowerCase()">
              {{ item.id }}
            </v-chip>
          </v-chip-group>
        </template>

        <template #item.reviews="{ item }">
          <FestivalEventReviewerChips :preview="item" />
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
        </template>

        <template #item.administrator="{ item }">
          {{ buildUserName(item.administrator) }}
        </template>

        <template #item.removal="{ item }">
          <v-btn
            icon="mdi-trash-can"
            size="small"
            variant="flat"
            @click.stop="openRemovalDialog(item)"
          />
        </template>
      </v-data-table>
    </v-card>
  </main>

  <v-btn
    icon="mdi-plus-thick"
    size="large"
    color="primary"
    class="btn-plus"
    rounded="pill"
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
        <v-icon left> mdi-trash-can </v-icon>Supprimer
      </template>
    </ConfirmationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type {
  PreviewFestivalTask,
  FestivalTask,
} from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { WRITE_FT } from "@overbookd/permission";
import { SlugifyService } from "@overbookd/slugify";
import type { User } from "@overbookd/user";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { buildUserName } from "@overbookd/user";
import { isDraftPreview } from "~/utils/festival-event/festival-task/festival-task.utils";
import { openTask, openTaskInNewTab } from "~/utils/festival-event/open-page";
import {
  type TaskFilters,
  type TaskReviewsFilter,
} from "~/utils/festival-event/festival-task/festival-task.filter";
import { getPreviewReviewerStatus } from "~/utils/festival-event/festival-task/festival-task.utils";
import { FT_URL } from "@overbookd/web-page";
import { DEFAULT_ITEMS_PER_PAGE } from "~/utils/vuetify/component-props";
import { ITEMS_PER_PAGE_QUERY_PARAM } from "~/utils/festival-event/festival-event.constant";
import { updateQueryParams } from "~/utils/http/url-params.utils";
import { useLiveNotification } from "~/composable/useLiveNotification";
import {
  FESTIVAL_TASK_CREATED,
  FESTIVAL_TASK_READY_TO_REVIEW,
  FESTIVAL_TASK_APPROVED,
  FESTIVAL_TASK_REJECTED,
  FESTIVAL_TASK_IGNORED,
  FESTIVAL_TASK_READY_TO_ASSIGN,
} from "@overbookd/domain-events";

useHead({ title: "Fiches Tâches" });

const ftStore = useFestivalTaskStore();
const userStore = useUserStore();
const layoutStore = useLayoutStore();

const me = computed<User | undefined>(() => userStore.loggedUser);

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
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const tasks = computed<PreviewFestivalTask[]>(() => ftStore.tasks.forAll);

const loading = ref<boolean>(tasks.value.length === 0);

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
  closeRemovalDialog();
};

const filters = ref<TaskFilters>({});

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
  (search?: string) => (task: Searchable<PreviewFestivalTask>) => {
    return keepMatchingSearchCriteria(search ?? "")(task);
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
      ([reviewer, status]) =>
        getPreviewReviewerStatus(task, reviewer) === status,
    );
  };
const filterTaskByReviewer =
  (adherentSearched?: User) => (task: PreviewFestivalTask) => {
    if (!adherentSearched) return true;
    if (isDraftPreview(task)) return false;
    return adherentSearched ? task.reviewer.id === adherentSearched.id : true;
  };

const filteredTasks = computed<PreviewFestivalTask[]>(() => {
  const {
    team,
    status,
    search,
    adherent,
    reviewer,
    itemsPerPage: _,
    ...reviews
  } = filters.value;
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

const updateItemsPerPage = (itemsPerPage: number) => {
  updateQueryParams(ITEMS_PER_PAGE_QUERY_PARAM, itemsPerPage);
};

const { festivalTasks } = useLiveNotification();
const { fetchAllTasks, addTaskToPreviews, updatePreviousPreview } = ftStore;

onMounted(() => {
  fetchAllTasks().then(() => (loading.value = false));
  festivalTasks.listen(FESTIVAL_TASK_CREATED, ({ data }) => {
    addTaskToPreviews(data.festivalTask);
  });
  festivalTasks.listen(FESTIVAL_TASK_READY_TO_REVIEW, ({ data }) => {
    updatePreviousPreview(data.festivalTask);
  });
  festivalTasks.listen(FESTIVAL_TASK_APPROVED, ({ data }) => {
    updatePreviousPreview(data.festivalTask);
  });
  festivalTasks.listen(FESTIVAL_TASK_REJECTED, ({ data }) => {
    updatePreviousPreview(data.festivalTask);
  });
  festivalTasks.listen(FESTIVAL_TASK_IGNORED, ({ data }) => {
    updatePreviousPreview(data.festivalTask);
  });
  festivalTasks.listen(FESTIVAL_TASK_READY_TO_ASSIGN, ({ data }) => {
    updatePreviousPreview(data.festivalTask);
  });
});

onUnmounted(() => {
  festivalTasks.stopListening();
});
</script>

<style lang="scss" scoped>
.quick-filters {
  padding: 0px 10px;
  display: flex;
  gap: 5px 10px;
  flex-wrap: wrap;
}
.task {
  display: flex;
  gap: $card-gap;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
  &__listing {
    height: fit-content;
    width: 100%;
    flex-grow: 4;
    margin-bottom: 40px !important;
  }
  &__filtering {
    flex-grow: 1;
    min-width: 280px;
  }
  #status {
    font-weight: bold;
  }
}

.btn-plus {
  position: fixed;
  right: 20px;
  bottom: 20px;
  @media screen and (max-width: $mobile-max-width) {
    bottom: calc($bottom-nav-height + 20px);
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
