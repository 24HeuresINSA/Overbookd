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
            <v-icon class="status-dot" :class="item.status.toLowerCase()">
              mdi-circle
            </v-icon>
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
  DRAFT,
  IN_REVIEW,
  REFUSED,
  VALIDATED,
} from "@overbookd/festival-event-constants";
import type { User } from "@overbookd/user";
import { FT_URL } from "@overbookd/web-page";

const userStore = useUserStore();
const ftStore = useFestivalTaskStore();

const currentAdherent = computed<User | undefined>(() => userStore.loggedUser);

ftStore.fetchAllTasks();

const MAX_TASKS = 6;

const myTasks = computed<PreviewFestivalTask[]>(() => {
  return ftStore.tasks.forAll.filter(
    (tasks) => tasks.administrator.id === currentAdherent.value?.id,
  );
});

const myDisplayedTasks = computed<PreviewFestivalTask[]>(() => {
  const statusOrder = [REFUSED, IN_REVIEW, DRAFT, VALIDATED];
  return myTasks.value
    .sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
    )
    .slice(0, MAX_TASKS);
});
</script>

<style lang="scss" scoped>
@use "./home-dashboard.scss" as *;

</style>
