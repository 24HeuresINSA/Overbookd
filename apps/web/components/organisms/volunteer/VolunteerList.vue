<template>
  <v-data-table
    :headers="headers"
    :items="props.volunteers"
    items-per-page="20"
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
        <v-btn size="small" @click="openCalendar(item.id)">
          <v-icon>mdi-calendar</v-icon>
        </v-btn>

        <v-btn size="small" :href="formatPhoneLink(item.phone)">
          <v-icon>mdi-phone</v-icon>
        </v-btn>

        <v-btn size="small" :href="`mailto:${item.email}`">
          <v-icon>mdi-email</v-icon>
        </v-btn>
      </div>
    </template>

    <template #no-data> Aucun bénévole trouvé </template>
  </v-data-table>
</template>

<script lang="ts" setup>
import type { UserPersonalData } from "@overbookd/user";
import {
  formatPhoneLink,
  formatUserNameWithNickname,
} from "~/utils/user/user.utils";
import type { Team } from "@overbookd/http";

const props = defineProps({
  volunteers: {
    type: Array as PropType<UserPersonalData[]>,
    required: true,
  },
});

const emit = defineEmits(["click:team"]);

const headers = [
  { title: "Prénom Nom (Surnom)", value: "name" },
  { title: "Equipes", value: "teams" },
  { title: "Charisme", value: "charisma", sortable: true },
  { title: "Actions", value: "actions" },
];

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
