<template>
  <v-card v-if="haveBalance" :to="FA_URL" class="home-card personal-fa" link>
    <v-card-title class="personal-fa__title">
      <v-icon>mdi-list-box-outline</v-icon>
      <h2>Mes FAs</h2>
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
            <strong>N° {{ item.id }} - {{ item.name }}</strong>
          </v-list-item-title>
          <div class="team-items">
            <TeamChip v-if="item.team" :team="item.team" with-name />
            <div v-else class="no-team">
              <span>Aucune équipe associée</span>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewFestivalActivity } from "@overbookd/festival-event";
import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";

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

const myActivities = computed<PreviewFestivalActivity[]>(() => {
  // Filtrer les activités par l'adherent spécifique
  return searchableActivities.value.filter((activity) => {
    return activity.adherent.id === currentAdherent.value?.id;
  });
});

const haveBalance = computed<boolean>(() =>
  userStore.can(HAVE_PERSONAL_ACCOUNT),
);
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
</style>
