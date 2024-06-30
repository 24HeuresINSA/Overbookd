<template>
  <v-data-table
    :headers="headers"
    :items="props.volunteers"
    items-per-page="20"
    :loading="loading"
    loading-text="Chargement des bénévoles..."
    no-data-text="Aucun bénévole trouvé"
    return-object
    @click:row="openInformationDialog"
  >
    <template #item.name="{ item }">
      {{ formatUserNameWithNickname(item) }}
    </template>

    <template #item.teams="{ item }">
      <div class="team-list">
        <TeamChip
          v-for="team of item.teams"
          :key="team"
          :team="team"
          with-name
          clickable
          @click="propagateClickedTeam"
        />
      </div>
    </template>

    <template #item.actions="{ item }">
      <div class="list-actions">
        <v-btn
          icon="mdi-calendar"
          size="small"
          @click="openCalendar(item.id)"
        />
        <v-btn
          icon="mdi-phone"
          size="small"
          :href="formatPhoneLink(item.phone)"
        />
        <v-btn icon="mdi-email" size="small" :href="`mailto:${item.email}`" />
      </div>
    </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import {
  formatPhoneLink,
  formatUserNameWithNickname,
} from "~/utils/user/user.utils";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import type { UserPersonalData } from "@overbookd/user";
import type { Team } from "@overbookd/http";

const props = defineProps({
  volunteers: {
    type: Array as PropType<UserPersonalData[]>,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const userStore = useUserStore();

const emit = defineEmits(["open-dialog", "click:team"]);

const headers = [
  { title: "Prénom Nom (Surnom)", value: "name" },
  { title: "Equipes", value: "teams" },
  { title: "Charisme", value: "charisma", sortable: true },
  { title: "Actions", value: "actions" },
];

const openInformationDialog = (
  event: MouseEvent,
  { item }: { item: UserDataWithPotentialyProfilePicture },
) => {
  const volunteer = { ...item };
  userStore.setSelectedUser(volunteer);
  emit("open-dialog");
};

const openCalendar = (volunteerId: number) => {
  window.open(`/planning/${volunteerId}`, "_blank");
};

const propagateClickedTeam = (team: Team) => {
  emit("click:team", team);
};
</script>

<style lang="scss" scoped>
.list-actions {
  display: flex;
  gap: 5px;
}

.team-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
</style>
