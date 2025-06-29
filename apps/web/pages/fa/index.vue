<template>
  <DesktopPageTitle />
  <div class="quick-filters">
    <nuxt-link :to="`${FA_URL}?adherent=${me?.id}`">
      <v-btn text="Mes FAs" variant="outlined" color="primary" />
    </nuxt-link>
  </div>
  <main class="activity fa">
    <FaFilter v-model="filters" class="activity__filtering" />
    <v-card class="activity__listing">
      <v-data-table
        :headers="tableHeaders"
        :items="filteredActivities"
        class="activity__table"
        :loading="loading"
        loading-text="Chargement des fiches activités..."
        no-data-text="Aucune fiche activité trouvée"
        :items-per-page="filters.itemsPerPage ?? DEFAULT_ITEMS_PER_PAGE"
        :hover="filteredActivities.length > 0"
        :mobile="isMobile"
        @click:row="openActivityFromDataTable"
        @auxclick:row="openActivityInNewTabFromDataTable"
        @update:items-per-page="updateItemsPerPage"
      >
        <template #item.id="{ item }">
          <v-chip-group id="status">
            <v-chip
              :class="item.status.toLowerCase()"
              :aria-label="getStatusLabel(item.status)"
              :title="getStatusLabel(item.status)"
            >
              {{ item.id }}
            </v-chip>
          </v-chip-group>
        </template>

        <template #item.reviews="{ item }">
          <FestivalEventReviewerChips :preview="item" />
        </template>

        <template #item.adherent="{ item }">
          {{ item.adherent ? buildUserName(item.adherent) : "" }}
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
        </template>

        <template #item.removal="{ item }">
          <v-btn
            icon="mdi-trash-can"
            aria-label="Supprimer la fiche activité"
            title="Supprimer la fiche activité"
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
    aria-label="Créer une fiche activité"
    title="Créer une fiche activité"
    size="large"
    color="primary"
    class="btn-plus"
    rounded="pill"
    @click="openNewActivityDialog"
  />

  <v-dialog v-model="isNewActivityDialogOpen" max-width="600">
    <CreateFaDialogCard @close="closeNewActivityDialog" />
  </v-dialog>

  <v-dialog v-model="isRemovalDialogOpen" max-width="600">
    <ConfirmationDialogCard
      confirm-color="error"
      @close="closeRemovalDialog"
      @confirm="removeActivity"
    >
      <template #title>
        Suppression de la FA #<strong>
          {{ activityToRemove?.id }}
        </strong>
      </template>
      <template #statement>
        Tu es sur le point de supprimer la FA
        <strong>{{ activityToRemove?.name }}.</strong>
        Es-tu sûr de faire ça ?
      </template>
      <template #confirm-btn-content>
        <v-icon left> mdi-trash-can </v-icon>Supprimer
      </template>
    </ConfirmationDialogCard>
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import { WRITE_FA } from "@overbookd/permission";
import type {
  FestivalActivity,
  PreviewFestivalActivity,
} from "@overbookd/festival-event";
import {
  BROUILLON,
  statusLabels,
  type Status,
} from "@overbookd/festival-event-constants";
import { SlugifyService } from "@overbookd/slugify";
import { type User, buildUserName } from "@overbookd/user";
import {
  type ActivityFilters,
  type ActivityReviewsFilter,
} from "~/utils/festival-event/festival-activity/festival-activity.filter";
import { isDraftPreview } from "~/utils/festival-event/festival-activity/festival-activity.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import {
  keepMatchingSearchCriteria,
  type Searchable,
} from "~/utils/search/search.utils";
import { getPreviewReviewStatus } from "~/utils/festival-event/festival-activity/festival-activity.utils";
import {
  openActivityFromDataTable,
  openActivityInNewTabFromDataTable,
} from "~/utils/festival-event/open-page";
import { useLiveNotification } from "~/composable/useLiveNotification";
import {
  FESTIVAL_ACTIVITY_CREATED,
  FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  FESTIVAL_ACTIVITY_APPROVED,
  FESTIVAL_ACTIVITY_REJECTED,
} from "@overbookd/domain-events";
import { FA_URL } from "@overbookd/web-page";
import { DEFAULT_ITEMS_PER_PAGE } from "~/utils/vuetify/component-props";
import { ITEMS_PER_PAGE_QUERY_PARAM } from "~/utils/festival-event/festival-event.constant";
import { updateQueryParams } from "~/utils/http/url-params.utils";

useHead({ title: "Fiches Activités" });

const faStore = useFestivalActivityStore();
const userStore = useUserStore();
const layoutStore = useLayoutStore();
const teamStore = useTeamStore();

const me = computed<User | undefined>(() => userStore.loggedUser);

const canRemoveActivity = computed<boolean>(() => userStore.can(WRITE_FA));
const tableHeaders = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Statut", value: "id", sortable: true },
    { title: "Validations", value: "reviews" },
    { title: "Nom", value: "name", sortable: true },
    { title: "Equipe", value: "team", sortable: true },
    { title: "Responsable", value: "adherent" },
  ];
  const removalHeader = { title: "Suppression", value: "removal" };
  return canRemoveActivity.value
    ? [...baseHeaders, removalHeader]
    : baseHeaders;
});
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const activities = computed<PreviewFestivalActivity[]>(
  () => faStore.activities.forAll,
);

const loading = ref<boolean>(activities.value.length === 0);

const getStatusLabel = (status: Status): string =>
  statusLabels.get(status) ?? BROUILLON;

const isNewActivityDialogOpen = ref<boolean>(false);
const openNewActivityDialog = () => (isNewActivityDialogOpen.value = true);
const closeNewActivityDialog = () => (isNewActivityDialogOpen.value = false);

const activityToRemove = ref<PreviewFestivalActivity | undefined>(undefined);
const isRemovalDialogOpen = ref<boolean>(false);
const openRemovalDialog = (activity: PreviewFestivalActivity) => {
  activityToRemove.value = activity;
  isRemovalDialogOpen.value = true;
};
const closeRemovalDialog = () => {
  isRemovalDialogOpen.value = false;
  activityToRemove.value = undefined;
};
const removeActivity = () => {
  if (!activityToRemove.value) return;
  faStore.remove(activityToRemove.value.id);
  closeRemovalDialog();
};

const filters = ref<ActivityFilters>({});

const searchableActivities = computed<Searchable<PreviewFestivalActivity>[]>(
  () =>
    activities.value.map((fa) => ({
      ...fa,
      searchable: SlugifyService.apply(`${fa.id} ${fa.name}`),
    })),
);
const filterActivityByTeam =
  (teamSearched?: Team) =>
  ({ team }: PreviewFestivalActivity) => {
    return teamSearched ? team === teamSearched.code : true;
  };
const filterActivityByAdherent =
  (adherentSearched?: User) =>
  ({ adherent }: PreviewFestivalActivity) => {
    return adherentSearched ? adherent.id === adherentSearched.id : true;
  };
const filterActivityByStatus =
  (statusSearched?: FestivalActivity["status"]) =>
  ({ status }: PreviewFestivalActivity) => {
    return statusSearched ? status === statusSearched : true;
  };
const filterActivityByNameAndId =
  (search?: string) => (activity: Searchable<PreviewFestivalActivity>) => {
    return keepMatchingSearchCriteria(search ?? "")(activity);
  };
const filterActivityByReviews =
  (reviews: ActivityReviewsFilter) =>
  (activity: Searchable<PreviewFestivalActivity>) => {
    const reviewersWithStatus = Object.entries(reviews).filter(
      ([, status]) => status !== undefined,
    );
    const reviewsAreEmpty = reviewersWithStatus.length === 0;
    if (reviewsAreEmpty) return true;

    if (isDraftPreview(activity)) return false;
    return reviewersWithStatus.every(
      ([reviewer, status]) =>
        getPreviewReviewStatus(activity, reviewer) === status,
    );
  };
const filterActivityBySupplyNeed =
  (needSupply?: boolean) => (activity: Searchable<PreviewFestivalActivity>) => {
    return !needSupply || activity.needSupply;
  };
const filteredActivities = computed<PreviewFestivalActivity[]>(() => {
  const {
    team,
    status,
    search,
    adherent,
    needSupply,
    itemsPerPage: _,
    ...reviews
  } = filters.value;

  return searchableActivities.value.filter((activity) => {
    return (
      filterActivityByTeam(team)(activity) &&
      filterActivityByAdherent(adherent)(activity) &&
      filterActivityByStatus(status)(activity) &&
      filterActivityByNameAndId(search)(activity) &&
      filterActivityByReviews(reviews)(activity) &&
      filterActivityBySupplyNeed(needSupply)(activity)
    );
  });
});

const updateItemsPerPage = (itemsPerPage: number) => {
  updateQueryParams(ITEMS_PER_PAGE_QUERY_PARAM, itemsPerPage);
};

const { festivalActivities } = useLiveNotification();
const { fetchAllActivities, addActivityToPreviews, updatePreviousPreview } =
  faStore;

fetchAllActivities().then(() => (loading.value = false));
if (teamStore.faReviewers.length === 0) teamStore.fetchFaReviewers();

onMounted(() => {
  festivalActivities.listen(FESTIVAL_ACTIVITY_CREATED, ({ data }) => {
    addActivityToPreviews(data.festivalActivity);
  });
  festivalActivities.listen(FESTIVAL_ACTIVITY_READY_TO_REVIEW, ({ data }) => {
    updatePreviousPreview(data.festivalActivity);
  });
  festivalActivities.listen(FESTIVAL_ACTIVITY_APPROVED, ({ data }) => {
    updatePreviousPreview(data.festivalActivity);
  });
  festivalActivities.listen(FESTIVAL_ACTIVITY_REJECTED, ({ data }) => {
    updatePreviousPreview(data.festivalActivity);
  });
});

onUnmounted(() => {
  festivalActivities.stopListening();
});
</script>

<style lang="scss" scoped>
.quick-filters {
  padding: 0px 10px;
  display: flex;
  gap: 5px 10px;
  flex-wrap: wrap;
}
.activity {
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

@media screen and (max-width: $mobile-max-width) {
  .activity {
    &__listing {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
