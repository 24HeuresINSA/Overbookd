<template>
  <v-card class="volunteer-list-card">
    <v-data-table
      :headers="headers"
      :items="volunteers"
      :loading="loading"
      loading-text="Chargement des bénévoles disponibles..."
      no-data-text="Aucun bénévole disponible pour t'aider 😭"
      :mobile="isMobile"
      :hover="volunteers.length > 0"
    >
      <template #item.volunteer="{ item }">
        <v-chip @click="openCalendarInNewTab(item.id)">
          {{ buildUserNameWithNickname(item) }}
        </v-chip>
      </template>
      <template #item.teams="{ item }">
        <div class="teams">
          <TeamChip v-for="team in item.teams" :key="team" :team="team" />
        </div>
      </template>
      <template #item.phone="{ item }">
        <div class="assignee-phone">
          <v-btn
            icon="mdi-phone"
            aria-label="Appeler"
            title="Appeler"
            :href="formatPhoneLink(item.phone)"
            density="comfortable"
            size="small"
            rounded="pill"
          />
          <h3>{{ formatPhoneNumber(item.phone) }}</h3>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import type { HelpingVolunteer } from "@overbookd/http";
import { formatPhoneLink, formatPhoneNumber } from "@overbookd/registration";
import { buildUserNameWithNickname } from "@overbookd/user";
import { PLANNING_URL } from "@overbookd/web-page";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const layoutStore = useLayoutStore();

defineProps({
  volunteers: {
    type: Array as PropType<HelpingVolunteer[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const headers: TableHeaders = [
  { title: "Bénévole", value: "volunteer" },
  { title: "Equipes", value: "teams" },
  { title: "Téléphone", value: "phone" },
];
const isMobile = computed<boolean>(() => layoutStore.isMobile);

const openCalendarInNewTab = (volunteerId: number) => {
  window.open(`${PLANNING_URL}/${volunteerId}`);
};
</script>

<style scoped>
.volunteer-list-card {
  height: fit-content;
  width: 100%;
}

.assignee-phone {
  display: flex;
  gap: 8px;
  align-items: center;
}
.teams {
  display: flex;
  gap: 5px;
}
</style>
