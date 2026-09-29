<template>
  <DesktopPageTitle />
  <div class="availabilities-page">
    <v-expansion-panels
      v-model="openedInformations"
      class="informations"
      rounded="xl"
    >
      <v-expansion-panel value="informations">
        <v-expansion-panel-title class="text-h6">
          <v-icon icon="mdi-information-outline" class="mr-2" />
          Comment remplir mes dispos ?
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <p>
            Coche tout ce que tu peux : plus tu as de points de charisme, plus
            tu as de chances de faire partie de l'aventure.
            <br />
            On ne t'affectera bien évidemment pas à tous tes créneaux, tu auras
            du temps pour te reposer et profiter du festival !
          </p>
          <ul class="rules">
            <li>
              <v-icon icon="mdi-gesture-tap" size="small" /> Sélectionne un
              créneau, ou la date pour prendre toute la journée.
            </li>
            <li class="rule-warning">
              <v-icon icon="mdi-timer-sand" size="small" /> Une dispo doit durer
              <strong>au moins 2 heures consécutives</strong>.
            </li>
            <li class="rule-warning">
              <v-icon icon="mdi-lock" size="small" /> Les créneaux verts ne sont
              plus modifiables une fois sauvegardés.
            </li>
          </ul>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-card class="overflow-visible">
      <v-card-text>
        <p class="charisma">
          Mon Charisme : {{ charisma }} {{ charismaEmoji }}
        </p>
        <AvailabilitiesStepper />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { EVIL_CHARISMA, EVIL, COOL } from "~/utils/easter-egg/evil-charisma";

useHead({ title: "Mes dispos" });

const myStore = useMyStore();
const availabilitiyStore = useVolunteerAvailabilityStore();
const charismaPeriodStore = useCharismaPeriodStore();
const layoutStore = useLayoutStore();

const openedInformations = ref<string[]>(
  layoutStore.isDesktop ? ["informations"] : [],
);

const volunteerId = computed<number>(() => myStore.loggedUser?.id ?? 0);
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

.informations {
  font-size: 1rem;
  width: auto;
  margin: 5px;
  :deep(.v-expansion-panel) {
    border-radius: $main-page-border-radius !important;
  }
  :deep(.v-expansion-panel-text__wrapper) {
    padding-top: 0;
  }
  .rules {
    list-style: none;
    margin-top: 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .rule-warning {
    color: rgb(var(--v-theme-error));
  }
}

.charisma {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>
