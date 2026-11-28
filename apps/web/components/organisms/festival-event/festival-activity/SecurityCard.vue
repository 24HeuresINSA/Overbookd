<template>
  <v-card>
    <v-card-title>Sécurité</v-card-title>

    <v-card-subtitle>
      Si tu as des questions sur les besoins ou le nom d'un dispositif de sécu
      de ton activité, contacte
      <a :href="`mailto:${SECURITE_EMAIL}`">{{ SECURITE_EMAIL }} </a>.
    </v-card-subtitle>

    <v-card-text class="d-flex flex-column ga-4">
      <v-textarea
        v-model="specialNeed"
        label="Dispositif de sécurité particulier"
        auto-grow
        rows="3"
        prepend-icon="mdi-security"
        hide-details
      />
      <v-text-field
        v-model="freePass"
        label="Nombre de laissez passer"
        prepend-icon="mdi-car"
        type="number"
        :rules="[rules.number, rules.min]"
        hide-details
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { FestivalActivity } from "@overbookd/festival-event";
import { isNumber, min } from "~/utils/rules/input.rules";
import { SECURITE_EMAIL } from "~/utils/mail/mail.constant";
import { useDebouncedModel } from "~/composable/useDebouncedModel";

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

const specialNeed = useDebouncedModel<string | null>(
  () => security.value.specialNeed,
  (canBeEmpty) => {
    const specialNeed = canBeEmpty?.trim() || null;
    faStore.updateSecurity({ specialNeed });
  },
);
const freePass = useDebouncedModel<number | string>(
  () => security.value.freePass,
  (freePass) => faStore.updateSecurity({ freePass: +freePass }),
);
</script>
