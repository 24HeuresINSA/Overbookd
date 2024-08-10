<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="volunteers"
      items-per-page="20"
      :loading="loading"
      loading-text="Chargement des bénévoles..."
      no-data-text="Aucun bénévole trouvé"
      :hover="volunteers.length > 0"
      return-object
      @click:row="openInformationDialog"
    >
      <template #item.firstname="{ item }">
        {{ buildUserNameWithNickname(item) }}
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
            @click.stop="openCalendar(item.id)"
          />
          <v-btn
            icon="mdi-phone"
            size="small"
            @click.stop="callVolunteer(item.phone)"
          />
          <v-btn
            icon="mdi-email"
            size="small"
            @click.stop="sendMailTo(item.email)"
          />
        </div>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts" setup>
import { formatPhoneLink } from "~/utils/user/user.utils";
import type { UserDataWithPotentialyProfilePicture } from "~/utils/user/user-information";
import {
  type UserPersonalData,
  buildUserNameWithNickname,
} from "@overbookd/user";
import type { Team } from "@overbookd/team";
import type { TableHeaders } from "~/utils/data-table/header";

const { volunteers, loading } = defineProps({
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

const headers: TableHeaders = [
  {
    title: "Prénom Nom (Surnom)",
    key: "firstname",
    sortable: true,
  },
  { title: "Equipes", value: "teams" },
  { title: "Charisme", value: "charisma", sortable: true },
  { title: "Actions", value: "actions" },
];

const openInformationDialog = async (
  _: MouseEvent,
  { item }: { item: UserDataWithPotentialyProfilePicture },
) => {
  const volunteer = { ...item };
  await userStore.setSelectedUser(volunteer);
  emit("open-dialog");
};

const propagateClickedTeam = (team: Team) => emit("click:team", team);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const openCalendar = (volunteerId: number) => {
  sendFailureNotification("Cette page n'est pas encore disponible");
  //window.open(`/planning/${volunteerId}`, "_blank");
};
const callVolunteer = (phone: string) => {
  window.location.href = formatPhoneLink(phone);
};
const sendMailTo = (email: string) => {
  window.location.href = `mailto:${email}`;
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
