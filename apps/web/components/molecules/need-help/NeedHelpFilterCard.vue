<template>
  <v-card>
    <v-card-title> Plage horaire et filtres </v-card-title>
    <v-card-text class="card-content">
      <div class="time-slot">
        <DateTimeField
          v-model="start"
          label="Début"
          class="card-field"
          hide-details
        />
        <DateTimeField
          v-model="end"
          label="Fin"
          class="card-field"
          hide-details
        />
        <v-btn
          text="Appliquer"
          color="secondary"
          class="card-field"
          :loading="loading"
          @click="fetchVolunteers"
        />
      </div>
      <v-divider />
      <div class="filters">
        <v-text-field
          v-model="search"
          label="Nom du bénévole"
          clear-icon="mdi-close-circle-outline"
          class="card-field"
          hide-details
          clearable
        />
        <SearchTeams
          v-model="teams"
          label="Filtrer par équipe"
          class="card-field"
          hide-details
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const needHelpStore = useNeedHelpStore();

const start = computed<Date>({
  get: () => needHelpStore.start,
  set: (value: Date) => needHelpStore.updateStart(value),
});
const end = computed<Date>({
  get: () => needHelpStore.end,
  set: (value: Date) => needHelpStore.updateEnd(value),
});
const search = computed<string>({
  get: () => needHelpStore.search,
  set: (value: string | null) => {
    needHelpStore.updateSearch(value);
  },
});
const teams = computed<Team[]>({
  get: () => needHelpStore.teams,
  set: (value: Team[]) => needHelpStore.updateTeams(value),
});

const emit = defineEmits(["fetch"]);
const fetchVolunteers = () => emit("fetch");
</script>

<style lang="scss" scoped>
.card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 5px;
}

.time-slot {
  display: flex;
  align-items: center;
  gap: 10px;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}

.filters {
  display: flex;
  gap: 10px;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }
}

.card-field {
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}
</style>
