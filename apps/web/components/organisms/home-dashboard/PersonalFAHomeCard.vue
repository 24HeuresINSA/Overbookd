<template>
  <v-card v-if="haveFA" :to="FA_URL" class="home-card personal-fa" link>
    <v-card-title class="personal-fa__title">
      <v-icon>mdi-list-box-outline</v-icon>
      <span>Mes FAs</span>
    </v-card-title>
    <v-list density="comfortable">
      <v-list-item
        v-for="item in myActivities"
        :key="item.id"
        :to="`/fa/${item.id}`"
        :href="'#' + item.id"
      >
        <v-list-item-content>
          <v-list-item-title class="activity-name">
            <strong>
              N° {{ item.id }} - {{ item.name }}
              <v-icon class="status-dot" :class="getStatusColor(item.status)">
                mdi-circle
                <span class="hover-detail">
                  {{ getHoverMessage(item.status) }}
                </span>
              </v-icon>
            </strong>
          </v-list-item-title>
          <div class="team-items">
            <TeamChip v-if="item.team" :team="item.team" with-name />
            <div v-else class="no-team">
              <span>Aucune équipe associée</span>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="searchableActivities.length > maxActivities">
        <v-list-item-content>
          <nuxt-link :to="`/fa?adherent=${currentAdherent?.id}`">
            <v-btn color="secondary" rounded="pill" density="comfortable">
              Mes FAs
            </v-btn>
          </nuxt-link>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewFestivalActivity } from "@overbookd/festival-event";
import { SlugifyService } from "@overbookd/slugify";
import type { User } from "@overbookd/user";
import { FA_URL } from "@overbookd/web-page";
import {
  ActivityFilterBuilder,
  type ActivityFilters,
} from "~/utils/festival-event/festival-activity/festival-activity.filter";
import type { Searchable } from "~/utils/search/search.utils";

const userStore = useUserStore();
const route = useRoute();
const faStore = useFestivalActivityStore();

const currentAdherent = computed<User | undefined>(() => userStore.loggedUser);

const filters = ref<ActivityFilters>({});
onMounted(() => {
  filters.value = ActivityFilterBuilder.getFromRouteQuery(route.query);
});

const activities = computed<PreviewFestivalActivity[]>(
  () => faStore.activities.forAll,
);

const searchableActivities = computed<Searchable<PreviewFestivalActivity>[]>(
  () =>
    activities.value.map((fa) => ({
      ...fa,
      searchable: SlugifyService.apply(`${fa.id} ${fa.name}`),
    })),
);

const maxActivities = 6;

const myActivities = computed<PreviewFestivalActivity[]>(() => {
  const statusOrder = ["REFUSED", "IN_REVIEW", "DRAFT", "VALIDATED"];
  const filteredActivities = searchableActivities.value
    .filter((activity) => activity.adherent.id === currentAdherent.value?.id)
    .sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    );
  return filteredActivities.slice(0, maxActivities);
});
type Status = "VALIDATED" | "REFUSED" | "IN_REVIEW" | "DRAFT";

const statusColors: Record<Status, string> = {
  VALIDATED: "green",
  REFUSED: "red",
  DRAFT: "grey",
  IN_REVIEW: "orange",
};

function getStatusColor(status: string | undefined | null): string {
  if (!status || !(status in statusColors)) {
    return "grey";
  }
  return statusColors[status as Status];
}

const haveFA = computed<boolean>(() => {
  return myActivities.value.length > 0;
});

function getHoverMessage(status: string | undefined): string {
  switch (status) {
    case "VALIDATED":
      return "Cette FA a été validée.";
    case "REFUSED":
      return "Cette FA a été refusée !";
    case "DRAFT":
      return "Cette FA est en brouillon.";
    case "IN_REVIEW":
      return "Cette FA est en cours de relecture.";
    default:
      return "Statut inconnu.";
  }
}
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.personal-fa {
  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: rgb(var(--v-theme-secondary));
    padding-bottom: 0;
  }
  &__content {
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 0;
  }
}

:deep(.v-list-item__spacer) {
  width: 8px !important;
}

.positive {
  color: rgb(var(--v-theme-success));
}
.positive-background {
  background-color: rgba(var(--v-theme-success), 0.1);
}
.negative {
  color: rgb(var(--v-theme-error));
}
.negative-background {
  background-color: rgba(var(--v-theme-error), 0.1);
}
.team-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.team-items {
  display: flex;
  gap: 10px;
}
.no-team {
  font-style: italic;
  color: gray;
}

.status-dot {
  font-size: 20px;
  position: relative;
  &.green {
    color: #4caf50;
  }
  &.red {
    color: #f44336;
  }
  &.grey {
    color: #9e9e9e;
  }
  &.orange {
    color: #ff9800;
  }

  .hover-detail {
    visibility: hidden;
    background-color: rgba(0, 0, 0, 0.75);
    color: white;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    position: absolute;
    z-index: 10;
    top: 120%;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
    font-size: 0.85rem;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .status-dot:hover .hover-detail {
    visibility: visible;
  }
}
</style>
