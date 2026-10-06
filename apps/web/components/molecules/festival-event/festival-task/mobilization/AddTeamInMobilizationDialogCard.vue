<template>
  <ConfirmationDialogCard @close="close" @confirm="addTeam">
    <template #title>Ajouter des bénévoles d'une équipe</template>
    <template #content>
      <div class="content">
        <div class="count">
          <v-btn
            v-if="canAddAllUsersFromTeam"
            :icon="
              isAllUsersFromTeamToggled
                ? 'mdi-account-multiple'
                : 'mdi-account-multiple-outline'
            "
            variant="outlined"
            color="secondary"
            :active="isAllUsersFromTeamToggled"
            aria-label="Ajouter tous les bénévoles de l'équipe"
            title="Ajouter tous les bénévoles de l'équipe"
            @click="toggleAllUsersFromTeam"
          />
          <v-text-field
            v-if="isAllUsersFromTeamToggled"
            model-value="Tous"
            label="Nombre de bénévoles"
            clearable
            hide-details
            readonly
            @click:clear="toggleAllUsersFromTeam"
          />
          <v-text-field
            v-else
            v-model="teamQuantity"
            type="number"
            label="Nombre de bénévoles"
            :rules="[isNumber, min(1)]"
            min="1"
            hide-details
          />
        </div>
        <SearchTeam v-model:team="team" :list="mobilizableTeams" hide-details />
      </div>
    </template>
    <template #confirm-btn-content>
      <v-icon icon="mdi-plus-circle-outline" left />Ajouter
    </template>
  </ConfirmationDialogCard>
</template>

<script lang="ts" setup>
import type { Mobilization, TeamMobilization } from "@overbookd/festival-event";
import type { Team } from "@overbookd/team";
import { isNumber, min } from "~/utils/rules/input.rules";
import { AFFECT_VOLUNTEER } from "@overbookd/permission";
import { ALL_TEAM_MEMBERS } from "@overbookd/festival-event-constants";

const teamStore = useTeamStore();
const myStore = useMyStore();

const props = defineProps({
  mobilization: {
    type: Object as () => Mobilization,
    required: true,
  },
});

const team = ref<Team | undefined>();
const teamQuantity = ref<string>("1");

const mobilizableTeams = computed<Team[]>(() => teamStore.mobilizableTeams);

const canAddAllUsersFromTeam = computed<boolean>(() =>
  myStore.can(AFFECT_VOLUNTEER),
);
const isAllUsersFromTeamToggled = ref<boolean>(false);
const toggleAllUsersFromTeam = () =>
  (isAllUsersFromTeamToggled.value = !isAllUsersFromTeamToggled.value);

const emit = defineEmits(["add", "close"]);

const close = () => {
  emit("close");
  team.value = undefined;
  teamQuantity.value = "1";
};
const addTeam = () => {
  if (!team.value || +teamQuantity.value < 1 || !props.mobilization) return;
  const count = isAllUsersFromTeamToggled.value
    ? ALL_TEAM_MEMBERS
    : +teamQuantity.value;
  const newTeam: TeamMobilization = { team: team.value.code, count };
  emit("add", props.mobilization, newTeam);
  close();
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.count {
  display: flex;
  gap: 10px;
}
</style>
