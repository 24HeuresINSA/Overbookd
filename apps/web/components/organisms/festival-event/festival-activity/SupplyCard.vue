<template>
  <v-card>
    <v-card-title>Besoin en électricité et eau</v-card-title>
    <v-card-subtitle>
      Précise tes besoins en électricité : 1 ligne par type d'appareil. Si ton
      activité a besoin d'eau, renseigne le débit dont tu as besoin et comment
      l'évacuer.<br />
      Pour plus de renseignement, vois avec la Log Elec via
      <a :href="`mailto:${LOGISTIQUE_EMAIL}`"> {{ LOGISTIQUE_EMAIL }} </a>.
    </v-card-subtitle>
    <v-card-text>
      <ElectricitySupplyTable
        :supplies="supply.electricity"
        @add="addElectricitySupply"
        @update="updateElectricitySupply"
        @remove="removeElectricitySupply"
      />
      <v-text-field
        :model-value="supply.water"
        label="Besoin en eau"
        @update:model-value="updateWaterSupply"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type {
  FestivalActivity,
  ElectricitySupply,
  PrepareElectricitySupplyCreation,
} from "@overbookd/festival-event";
import { LOGISTIQUE_EMAIL } from "~/utils/mail/mail.constant";

const faStore = useFestivalActivityStore();

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const supply = computed<FestivalActivity["supply"]>(
  () => selectedActivity.value.supply,
);

const addElectricitySupply = (supply: PrepareElectricitySupplyCreation) => {
  faStore.addElectricitySupply(supply);
};
const updateElectricitySupply = (supply: ElectricitySupply) => {
  faStore.updateElectricitySupply(supply);
};
const removeElectricitySupply = (supply: ElectricitySupply) => {
  faStore.removeElectricitySupply(supply.id);
};

const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const updateWaterSupply = (canBeEmpty: string) => {
  if (delay.value) clearInterval(delay.value);
  const water = canBeEmpty.trim() ? canBeEmpty : null;
  delay.value = setTimeout(() => faStore.updateSupply({ water }), 800);
};
</script>
