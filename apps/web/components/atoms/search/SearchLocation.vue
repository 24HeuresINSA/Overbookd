<template>
  <v-autocomplete
    v-model="location"
    :items="locations"
    :loading="loading"
    item-value="id"
    item-title="name"
    :label="label"
    :disabled="disabled"
    chips
    :clearable="clearable"
    return-object
    no-date-text="Aucune localisation correspondante"
  />
</template>

<script lang="ts" setup>
import type { SignaLocation } from "@overbookd/signa";

const locationStore = useLocationStore();

type MinimalLocation = Pick<SignaLocation, "id" | "name">;
const location = defineModel<MinimalLocation | null>({ required: true });

defineProps({
  label: {
    type: String,
    default: "Chercher un lieu",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: false,
  },
});

const locations = computed<MinimalLocation[]>(() => locationStore.all);
const loading = ref<boolean>(locations.value.length === 0);
locationStore.fetchAllLocations().then(() => (loading.value = false));
</script>
