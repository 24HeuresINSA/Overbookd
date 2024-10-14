<template>
  <v-card class="volunteer-list-card">
    <v-data-table
      :headers="headers"
      :items="volunteers"
      :loading="loading"
      :items-per-page="20"
      loading-text="Chargement des bénévoles disponibles..."
      no-data-text="Aucun bénévole disponible pour t'aider 😭"
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
          <v-btn icon="mdi-phone" :href="formatPhoneLink(item.phone)" />
          <h3>{{ formatUserPhone(item.phone) }}</h3>
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import type { HelpingVolunteer } from "@overbookd/http";
import { buildUserNameWithNickname } from "@overbookd/user";
import TeamChip from "~/components/atoms/chip/TeamChip.vue";
import { formatPhoneLink, formatUserPhone } from "~/utils/user/user.utils";
import type { TableHeaders } from "~/utils/vuetify/component-props";

const needHelpStore = useNeedHelpStore();

const headers: TableHeaders = [
  { title: "Bénévole", value: "volunteer" },
  { title: "Equipes", value: "teams" },
  { title: "Téléphone", value: "phone" },
];

const volunteers = computed<HelpingVolunteer[]>(
  () => needHelpStore.filteredVolunteers,
);

const loading = ref<boolean>(volunteers.value.length === 0);
needHelpStore.fetchVolunteers().then(() => (loading.value = false));

const openCalendarInNewTab = (volunteerId: number) => {
  window.open(`/planning/${volunteerId}`, "_blank");
};
</script>

<style lang="scss" scoped>
.volunteer-list-card {
  height: fit-content;
  width: 100%;
}

.assignee-phone {
  display: flex;
  gap: 5px;
  align-items: center;
}
.teams {
  display: flex;
  gap: 5px;
}
</style>
