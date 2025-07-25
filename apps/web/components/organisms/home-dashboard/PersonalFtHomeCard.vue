<template>
  <v-card :to="FT_URL" class="home-card ft" link>
    <v-card-title class="home-card__title">
      <v-icon>mdi-list-box-outline</v-icon>
      <span>Mes FTs</span>
    </v-card-title>

    <v-card-text class="home-card__content">
      <v-list v-if="myTasks.length > 0" density="comfortable">
        <v-list-item
          v-for="item in myDisplayedTasks"
          :key="item.id"
          :to="`${FT_URL}/${item.id}`"
        >
          <v-list-item-title class="content-title ft">
            <strong> N° {{ item.id }} - {{ item.name }} </strong>
            <v-icon
              class="status-dot"
              :class="item.status.toLowerCase()"
              icon="mdi-circle"
              :aria-label="getStatusLabel(item.status)"
              :title="getStatusLabel(item.status)"
            />
          </v-list-item-title>
          <FestivalEventReviewerChips :preview="item" />
        </v-list-item>
        <v-list-item v-if="myTasks.length > MAX_TASKS">
          <nuxt-link :to="`${FT_URL}?adherent=${currentAdherent?.id}`">
            <v-btn
              text="Voir mes FTs"
              color="secondary"
              rounded="pill"
              density="comfortable"
              class="home-card__button"
            />
          </nuxt-link>
        </v-list-item>
      </v-list>
      <span v-else class="no-content-label">
        Tu n'as aucune FTs 🤔<br />
        J'espère que t'as une bonne excuse !
      </span>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { PreviewFestivalTask } from "@overbookd/festival-event";
import {
  BROUILLON,
  DRAFT,
  IN_REVIEW,
  REFUSED,
  VALIDATED,
  statusLabels,
  type Status,
} from "@overbookd/festival-event-constants";
import type { User } from "@overbookd/user";
import { FT_URL } from "@overbookd/web-page";

const userStore = useUserStore();
const ftStore = useFestivalTaskStore();
const teamStore = useTeamStore();

const currentAdherent = computed<User | undefined>(() => userStore.loggedUser);

ftStore.fetchMyTasks();
if (teamStore.ftReviewers.length === 0) teamStore.fetchFtReviewers();

const MAX_TASKS = 5;

const myTasks = computed<PreviewFestivalTask[]>(() => ftStore.tasks.mine);

const myDisplayedTasks = computed<PreviewFestivalTask[]>(() => {
  const statusOrder = [REFUSED, IN_REVIEW, DRAFT, VALIDATED];
  return myTasks.value
    .sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    )
    .slice(0, MAX_TASKS);
});

const getStatusLabel = (status: Status): string =>
  statusLabels.get(status) ?? BROUILLON;
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;
</style>
