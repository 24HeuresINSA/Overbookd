<template>
  <v-card :to="FA_URL" class="home-card fa" link>
    <v-card-title class="home-card__title">
      <v-icon>mdi-list-box-outline</v-icon>
      <span>Mes FAs</span>
    </v-card-title>

    <v-card-text class="home-card__content">
      <v-list v-if="myActivities.length > 0" density="comfortable">
        <v-list-item
          v-for="item in myDisplayedActivities"
          :key="item.id"
          :to="`${FA_URL}/${item.id}`"
        >
          <v-list-item-title class="activity-name">
            <strong>
              N° {{ item.id }} - {{ item.name }}
              <v-icon class="status-dot" :class="item.status.toLowerCase()">
                mdi-circle
              </v-icon>
            </strong>
          </v-list-item-title>
          <div class="team-items">
            <TeamChip v-if="item.team" :team="item.team" with-name />
            <div v-else class="no-team">
              <span>Aucune équipe associée</span>
            </div>
          </div>
        </v-list-item>
        <v-list-item v-if="myActivities.length > MAX_ACTIVITIES">
          <nuxt-link :to="`${FA_URL}?adherent=${currentAdherent?.id}`">
            <v-btn
              text="Voir mes FAs"
              color="secondary"
              rounded="pill"
              density="comfortable"
            />
          </nuxt-link>
        </v-list-item>
      </v-list>
      <span v-else class="no-content-label">
        Tu n'as aucune FA 🤔<br />
        T'es sûr de servir à quelque chose ?
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewFestivalActivity } from "@overbookd/festival-event";
import {
  DRAFT,
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import type { User } from "@overbookd/user";
import { FA_URL } from "@overbookd/web-page";

const userStore = useUserStore();
const faStore = useFestivalActivityStore();

const currentAdherent = computed<User | undefined>(() => userStore.loggedUser);

faStore.fetchMyActivities();

const MAX_ACTIVITIES = 6;

const myActivities = computed<PreviewFestivalActivity[]>(() => {
  return faStore.activities.mine.filter(
    (activity) => activity.adherent.id === currentAdherent.value?.id,
  );
});

const myDisplayedActivities = computed<PreviewFestivalActivity[]>(() => {
  const statusOrder = [REFUSED, IN_REVIEW, DRAFT, VALIDATED];
  return myActivities.value
    .sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    )
    .slice(0, MAX_ACTIVITIES);
});
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

.team-items {
  display: flex;
  gap: 10px;
}
.no-team {
  font-style: italic;
  color: gray;
}
</style>
