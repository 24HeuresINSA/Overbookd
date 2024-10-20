<template>
  <div class="timeline-form">
    <v-card>
      <v-card-title>
        Plage horaire
        <v-btn
          icon="mdi-refresh"
          color="secondary"
          density="comfortable"
          size="small"
          class="ml-1"
          @click="refreshToNow"
        />
      </v-card-title>
      <v-card-text class="card-content">
        <DateTimeField v-model="start" label="Début" hide-details />
        <DateTimeField v-model="end" label="Fin" hide-details />
        <v-btn
          text="Appliquer"
          color="primary"
          :loading="loading"
          @click="updateTimelineFilter"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Filtres </v-card-title>
      <v-card-text class="card-content">
        <v-text-field
          v-model="search"
          label="Nom de la tache"
          clear-icon="mdi-close-circle-outline"
          clearable
          hide-details
        />
        <SearchTeams v-model="teams" label="Filtrer par équipe" hide-details />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { Period, type IProvidePeriod } from "@overbookd/time";
import type { Team } from "@overbookd/team";

const timelineStore = useTimelineStore();

const loading = ref<boolean>(true);
timelineStore.fetchEvents().then(() => {
  loading.value = false;
});

const start = ref(timelineStore.start);
const end = ref(timelineStore.end);

const period = computed<IProvidePeriod>(() => ({
  start: start.value,
  end: end.value,
}));
const search = computed<string>({
  get: () => timelineStore.search,
  set: (value) => {
    timelineStore.updateSearch(value);
  },
});
const teams = computed<Team[]>({
  get: () => timelineStore.teams,
  set: (value) => {
    timelineStore.updateTeams(value);
  },
});

const updateTimelineFilter = async () => {
  try {
    Period.init(period.value);
  } catch (_error) {
    sendFailureNotification("La plage horaire est invalide");
    return;
  }
  loading.value = true;
  await timelineStore.updatePeriod(period.value);
  loading.value = false;
};
const refreshToNow = async () => {
  start.value = timelineStore.start;
  end.value = timelineStore.end;

  loading.value = true;
  await timelineStore.resetToDefaultPeriod();
  loading.value = false;
};
</script>

<style lang="scss" scoped>
.timeline-form {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-bottom: 10px;

  .card-content {
    display: flex;
    gap: 20px;
    align-items: center;
    padding: 10px;
    @media only screen and (max-width: $mobile-max-width) {
      gap: 5px;
      flex-direction: column;
      * {
        width: 100%;
      }
    }
  }
}
</style>
