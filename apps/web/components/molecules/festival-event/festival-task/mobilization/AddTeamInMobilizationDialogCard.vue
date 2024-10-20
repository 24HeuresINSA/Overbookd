<template>
  <ConfirmationDialogCard @close="close" @confirm="addTeam">
    <template #title>Ajouter des bénévoles d'une équipe</template>
    <template #statement>
      <v-text-field
        v-model="count"
        type="number"
        label="Nombre de bénévoles"
        :rules="[isNumber, min(1)]"
      />
      <SearchTeam v-model="team" :list="mobilizableTeams" hide-details />
    </template>
    <template #confirm-btn-content>
      <v-icon left> mdi-plus-circle-outline </v-icon>Ajouter
    </template>
  </ConfirmationDialogCard>
</template>

<script lang="ts" setup>
import type { Mobilization, TeamMobilization } from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { isNumber, min } from "~/utils/rules/input.rules";

const teamStore = useTeamStore();

const props = defineProps({
  mobilization: {
    type: Object as () => Mobilization,
    required: true,
  },
});

const team = ref<Team | undefined>();
const count = ref<string>("1");

const mobilizableTeams = computed<Team[]>(() => teamStore.mobilizableTeams);

const emit = defineEmits(["add", "close"]);

const close = () => {
  emit("close");
  team.value = undefined;
  count.value = "1";
};
const addTeam = () => {
  if (!team.value || +count.value < 1 || !props.mobilization) return;
  const newTeam: TeamMobilization = {
    team: team.value.code,
    count: +count.value,
  };
  emit("add", props.mobilization, newTeam);
  close();
};
</script>
