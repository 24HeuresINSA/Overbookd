<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items="volunteers"
      :loading="loading"
      loading-text="Chargement des bénévoles..."
      no-data-text="Aucun bénévole trouvé"
      :class="{ unclickable: !canViewVolunteerDetails }"
      :hover="volunteers.length > 0 && canViewVolunteerDetails"
      :mobile="isMobile"
      return-object
      @click:row="propagateClickedVolunteer"
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
        <v-btn
          icon="mdi-calendar"
          aria-label="Ouvrir le planning"
          title="Ouvrir le planning"
          size="small"
          variant="flat"
          @click.stop="openCalendar(item.id)"
        />
        <v-btn
          icon="mdi-phone"
          aria-label="Appeler le téléphone"
          title="Appeler le téléphone"
          size="small"
          variant="flat"
          @click.stop="callVolunteer(item.phone)"
        />
        <v-btn
          icon="mdi-email"
          aria-label="Envoyer un mail"
          title="Envoyer un mail"
          size="small"
          variant="flat"
          @click.stop="sendMailTo(item.email)"
        />
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
import { VIEW_VOLUNTEER_DETAILS } from "@overbookd/permission";
import type { TableHeaders } from "~/utils/vuetify/component-props";
import { PLANNING_URL } from "@overbookd/web-page";

defineProps({
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
const layoutStore = useLayoutStore();

const canViewVolunteerDetails = computed(() =>
  userStore.can(VIEW_VOLUNTEER_DETAILS),
);
const headers = computed<TableHeaders>(() => {
  const baseHeaders = [
    { title: "Nom", key: "firstname", sortable: true },
    { title: "Equipes", value: "teams" },
    { title: "Charisme", value: "charisma", sortable: true },
  ];
  const actionsHeader = { title: "Actions", value: "actions" };
  return canViewVolunteerDetails.value
    ? [...baseHeaders, actionsHeader]
    : baseHeaders;
});

const isMobile = computed<boolean>(() => layoutStore.isMobile);

const emit = defineEmits(["click:volunteer", "click:team"]);
const propagateClickedVolunteer = (
  _: MouseEvent,
  { item }: { item: UserDataWithPotentialyProfilePicture },
) => emit("click:volunteer", { ...item });
const propagateClickedTeam = (team: Team) => emit("click:team", team);

const openCalendar = (volunteerId: number) => {
  window.open(`${PLANNING_URL}/${volunteerId}`);
};
const callVolunteer = (phone: string) => {
  window.location.href = formatPhoneLink(phone);
};
const sendMailTo = (email: string) => {
  window.location.href = `mailto:${email}`;
};
</script>

<style lang="scss" scoped>
.unclickable :deep(.v-data-table__tr--clickable) {
  cursor: default;
}

.team-list {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
}
</style>
