<template>
  <div class="filter-cards">
    <v-card>
      <v-card-title> Plage horaire </v-card-title>
      <v-card-text class="time-slot">
        <DateTimeField v-model="start" label="Début" />
        <DateTimeField v-model="end" label="Fin" />
        <v-btn
          text="Appliquer"
          color="secondary"
          class="time-slot__apply-btn"
          @click="getVolunteers"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Filtres </v-card-title>
      <v-card-text>
        <SearchTeams v-model="teams" label="Filtrer par équipe" />
        <v-text-field
          v-model="search"
          label="Nom du bénévole"
          clear-icon="mdi-close-circle-outline"
          clearable
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";

const needHelpStore = useNeedHelpStore();

const start = ref<Date>(new Date());
const end = ref<Date>(new Date());

const search = computed<string>({
  get: () => needHelpStore.search,
  set: (value: string | null) => {
    needHelpStore.updateSearch(value);
  },
});
const teams = computed<Team[]>({
  get: () => needHelpStore.teams,
  set: (value: Team[]) => {
    needHelpStore.updateTeams(value);
  },
});

const setTimeRange = () => {
  start.value = needHelpStore.start;
  end.value = needHelpStore.end;
};
const refreshToNow = () => {
  needHelpStore.resetToDefaultPeriod();
  setTimeRange();
};
const getVolunteers = () => {
  needHelpStore.updatePeriod({ start: start.value, end: end.value });
};

onMounted(() => refreshToNow());
</script>

<style lang="scss" scoped>
.filter-cards {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}

.time-slot {
  padding-top: 5px;
  &__apply-btn {
    width: 100%;
  }
}
</style>
