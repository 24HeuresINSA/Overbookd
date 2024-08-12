<template>
  <v-card>
    <v-card-title> Signa </v-card-title>
    <v-card-subtitle>
      Contacte la signa via
      <a :href="`mailto:${SIGNALETIQUE_EMAIL}`">{{ SIGNALETIQUE_EMAIL }}</a>
      pour ajouter des lieux non existants dans la liste déroulante.
    </v-card-subtitle>

    <v-card-text>
      <SearchLocation
        :model-value="signa.location"
        label="Lieu de l'activité"
        @update:model-value="updateLocation"
      />

      <h3>Demande de signalétique</h3>
      <FaSignageTable
        :signages="signa.signages"
        @add="addSignage"
        @update="updateSignage"
        @remove="removeSignage"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import {
  type FestivalActivity,
  type Signage,
  type Location,
  type PrepareSignageCreation,
} from "@overbookd/festival-event";
import { SIGNALETIQUE_EMAIL } from "~/utils/mail/mail.constant";

const faStore = useFestivalActivityStore();

const selectedActivity = computed<FestivalActivity>(
  () => faStore.selectedActivity,
);
const signa = computed<FestivalActivity["signa"]>(
  () => selectedActivity.value.signa,
);

const updateLocation = (location: Location | null) => {
  const locationId = location?.id ?? null;
  faStore.updateSigna({ locationId });
};

const addSignage = (signage: PrepareSignageCreation) => {
  faStore.addSignage(signage);
};
const updateSignage = (signage: Signage) => {
  faStore.updateSignage(signage);
};
const removeSignage = (signage: Signage) => {
  faStore.removeSignage(signage.id);
};
</script>
