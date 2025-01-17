<template>
  <v-card>
    <v-card-title>Sécurité</v-card-title>
    <v-card-subtitle>
      Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu
      de ton activité, contacte
      <a :href="`mailto:${SECURITE_EMAIL}`">{{ SECURITE_EMAIL }} </a>.
    </v-card-subtitle>
    <v-card-text>
      <v-textarea
        :model-value="security.specialNeed"
        label="Dispositif de sécurité particulier"
        auto-grow
        rows="2"
        prepend-icon="mdi-security"
        @update:model-value="updateSpecialNeed"
      />
      <v-text-field
        :model-value="security.freePass"
        label="Nombre de laissez passer"
        prepend-icon="mdi-car"
        type="number"
        :rules="[rules.number, rules.min]"
        @update:model-value="updateFreePass"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";
import { isNumber, min } from "~/utils/rules/input.rules";
import { SECURITE_EMAIL } from "~/utils/mail/mail.constant";

const faStore = useFestivalActivityStore();

const rules = {
  number: isNumber,
  min: min(0),
};

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const security = computed<FestivalActivity["security"]>(
  () => selectedActivity.value.security,
);

const updateSpecialNeed = useDebounceFn((canBeEmpty: string) => {
  const specialNeed = canBeEmpty.trim() || null;
  faStore.updateSecurity({ specialNeed });
}, 800);
const updateFreePass = useDebounceFn((freePass: string) => {
  faStore.updateSecurity({ freePass: +freePass });
}, 800);
</script>
