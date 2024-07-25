<template>
  <h1>Fiches Activités</h1>
  <div class="activity fa">
    <FaFilter v-model="filters" class="activity__filtering" />
    <v-card class="activity__listing">
      <v-data-table
        :headers="tableHeaders"
        :items="filteredActivities"
        :items-per-page="20"
        class="activity__table"
        :loading="loading"
        loading-text="Chargement des fiches activités..."
        no-data-text="Aucune fiche activité trouvée"
        :hover="filteredActivities.length > 0"
        @click:row="openActivity"
        @auxclick:row="openActivityInNewTab"
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

        <template #item.adherent="{ item }">
          {{ item.adherent ? formatUsername(item.adherent) : "" }}
        </template>

        <template #item.team="{ item }">
          <TeamChip v-if="item.team" :team="item.team" with-name />
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
        <v-icon left> mdi-delete </v-icon>Supprimer
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
  Reviewer,
} from "@overbookd/festival-event";
import { SlugifyService } from "@overbookd/slugify";
import type { User } from "@overbookd/user";
import {
  ActivityFilterBuilder,
  type ActivityFilters,
  type ActivityReviewsFilter,
} from "~/utils/festival-event/festival-activity/festival-activity.filter";
import { isDraftPreview } from "~/utils/festival-event/festival-activity/festival-activity.model";
import type { TableHeaders } from "~/utils/data-table/header";
import type { Searchable } from "~/utils/search/search.utils";
import { formatUsername } from "~/utils/user/user.utils";
import { getPreviewReviewStatus } from "~/utils/festival-event/festival-activity/festival-activity.utils";
import {
  openActivity,
  openActivityInNewTab,
} from "~/utils/festival-event/open-page";
import { findReviewStatus } from "~/utils/festival-event/festival-event.utils";

useHead({ title: "Fiches Activités" });

const route = useRoute();
const faStore = useFestivalActivityStore();
const teamStore = useTeamStore();
const userStore = useUserStore();

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

const activities = computed<PreviewFestivalActivity[]>(
  () => faStore.activities.forAll,
);
const reviewers = computed<Team[]>(() => teamStore.faReviewers);

await teamStore.fetchFaReviewers();
const loading = ref<boolean>(activities.value.length === 0);
faStore.fetchAllActivities().then(() => (loading.value = false));

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
};

const getReviewerStatus = (
  activity: PreviewFestivalActivity,
  reviewer: Team,
): string => {
  if (isDraftPreview(activity)) return "";
  const reviewerCode = reviewer.code as Reviewer<"FA">;
  const status = activity.reviews[`${reviewerCode}`];
  return (findReviewStatus(status) ?? "").toLowerCase();
};

const filters = ref<ActivityFilters>({});
onMounted(
  () => (filters.value = ActivityFilterBuilder.getFromRouteQuery(route.query)),
);

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
  (search?: string) =>
  ({ searchable }: Searchable<PreviewFestivalActivity>) => {
    const slugifiedSearch = SlugifyService.apply(search ?? "");
    return searchable.includes(slugifiedSearch);
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
const filteredActivities = computed<PreviewFestivalActivity[]>(() => {
  const { team, status, search, adherent, ...reviews } = filters.value;

  return searchableActivities.value.filter((activity) => {
    return (
      filterActivityByTeam(team)(activity) &&
      filterActivityByAdherent(adherent)(activity) &&
      filterActivityByStatus(status)(activity) &&
      filterActivityByNameAndId(search)(activity) &&
      filterActivityByReviews(reviews)(activity)
    );
  });
});
</script>

<style lang="scss" scoped>
.activity {
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
  .activity {
    &__listing {
      margin: 0;
      width: 100%;
    }
  }
}
</style>
