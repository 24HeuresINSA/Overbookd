<template>
  <v-card>
    <v-card-title> Plage horaire et filtres </v-card-title>
    <v-card-text class="card-content">
      <div class="time-slot">
        <DateTimeField
          v-model="period.start"
          label="Début"
          class="card-field"
          hide-details
          @enter="fetchVolunteers"
        />
        <DateTimeField
          v-model="period.end"
          label="Fin"
          class="card-field"
          hide-details
          @enter="fetchVolunteers"
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
import type { IProvidePeriod } from "@overbookd/time";

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
});

const needHelpStore = useNeedHelpStore();

const period = ref<IProvidePeriod>(needHelpStore.period);

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
const fetchVolunteers = () => {
  needHelpStore.updatePeriod(period.value);
  emit("fetch");
};
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
