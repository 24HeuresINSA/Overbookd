<template>
  <DesktopPageTitle />
  <div class="availabilities-page">
    <v-card>
      <v-card-title>Informations</v-card-title>
      <v-card-text>
        Remplis tes disponibilités, plus tu as de points de charisme, plus tu as
        de chances de faire partie de l'aventure.
        <br />
        Coche tout ce que tu peux, nous ne t'affecterons bien évidemment pas à
        tous tes créneaux et te laisserons du temps pour te reposer et profiter
        du festival !
      </v-card-text>
    </v-card>

    <v-alert icon="mdi-alert" title="Attention !" color="tertiary" closable>
      <template #text>
        Les disponibilités doivent durer au moins 2 heures consécutives.
        <br />
        Les créneaux verts ne sont plus modifiables une fois sauvegardés.
      </template>
    </v-alert>

    <v-alert
      icon="mdi-lightbulb-alert-outline"
      title="Astuce"
      text="Tu peux sélectionner tous les créneaux d'une journée en cliquant sur le chiffre de la date."
      color="secondary"
      closable
    />

    <v-card>
      <v-card-title>
        Mon Charisme : {{ charisma }} {{ charismaEmoji }}
      </v-card-title>
      <v-card-text>
        <AvailabilitiesStepper />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { EVIL_CHARISMA, EVIL, COOL } from "~/utils/easter-egg/evil-charisma";

useHead({ title: "Mes dispos" });

const userStore = useUserStore();
const availabilitiyStore = useVolunteerAvailabilityStore();
const charismaPeriodStore = useCharismaPeriodStore();

const volunteerId = computed<number>(() => userStore.loggedUser?.id ?? 0);
const charisma = computed<number>(
  () => availabilitiyStore.currentCharisma ?? 0,
);
const charismaEmoji = computed<string>(() =>
  charisma.value === EVIL_CHARISMA ? EVIL.emoji : COOL.emoji,
);

charismaPeriodStore.fetchCharismaPeriods();
availabilitiyStore.fetchVolunteerAvailabilities(volunteerId.value);
</script>

<style lang="scss" scoped>
.availabilities-page {
  display: flex;
  flex-direction: column;
  gap: $card-gap;
}
</style>
