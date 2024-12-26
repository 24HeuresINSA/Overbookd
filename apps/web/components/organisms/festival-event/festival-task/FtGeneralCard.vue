<template>
  <v-card>
    <v-card-title>Général</v-card-title>
    <v-card-subtitle>
      <p>
        Si tu as des questions, n'hésite pas à contacter
        <a :href="`mailto:${HUMAINS_EMAIL}`"> {{ HUMAINS_EMAIL }} </a>.
      </p>
      <p>
        Tu peux aussi t'aider en allant voir les FT de l'année dernière sur
        <a :href="CTMA_URL">cetaitmieuxavant</a>
        en te connectant avec {{ CTMA_EMAIL }}.
      </p>
    </v-card-subtitle>

    <v-card-text>
      <v-text-field
        :model-value="general.name"
        label="Nom de la FT"
        :disabled="disabled"
        @update:model-value="updateName"
      />
      <SearchUser
        :model-value="general.administrator"
        label="Gestionnaire de la FT"
        :disabled="disabled"
        @update:model-value="updateAdministrator"
      />
      <SearchTeam
        :team="inChargeTeam"
        label="Équipe"
        :disabled="disabled"
        @update:team="updateTeam"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Team } from "@overbookd/team";
import type { User } from "@overbookd/user";
import type { FestivalTask } from "@overbookd/festival-event";
import { CTMA_EMAIL, HUMAINS_EMAIL } from "~/utils/mail/mail.constant";
import { CTMA_URL } from "~/utils/navigation/url.constant";

const ftStore = useFestivalTaskStore();
const teamStore = useTeamStore();

defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
});

const selectedTask = computed<FestivalTask>(() => ftStore.selectedTask);
const general = computed<FestivalTask["general"]>(
  () => selectedTask.value.general,
);
const inChargeTeam = computed<Team | undefined>(() =>
  teamStore.getTeamByCode(general.value.team ?? ""),
);

const delay = ref<ReturnType<typeof setTimeout> | undefined>();
const updateName = (name: string) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(() => ftStore.updateGeneral({ name }), 800);
};

const updateAdministrator = (administrator: User) => {
  const administratorId = administrator.id;
  ftStore.updateGeneral({ administratorId });
};
const updateTeam = (team: Team) => ftStore.updateGeneral({ team: team.code });
</script>
