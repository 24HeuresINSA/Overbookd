<template>
  <DialogCard @close="close">
    <template #title>Ajouter un nouveau lieu</template>
    <template #content>
      <v-text-field v-model="name" label="Nom du lieu" />
      <LocationMapEditor v-model="geoLocation" />
    </template>
    <template #actions>
      <v-btn
        text="Ajouter le lieu"
        size="large"
        :disabled="!isNewLocationDefined"
        @click="createNewLocation"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { Point } from "@overbookd/geo-location";
import { defaultMapConfiguration } from "~/utils/map.config";

const locationStore = useLocationStore();

const defaultGeoLocation = Point.create(defaultMapConfiguration.center);

const name = ref<string>("");
const geoLocation = ref<Point>(defaultGeoLocation);

const isNewLocationDefined = computed<boolean>(() => name.value.length > 0);

const emit = defineEmits(["close"]);
const close = () => emit("close");

const createNewLocation = async () => {
  if (!isNewLocationDefined.value) return;
  await locationStore.createLocation({
    name: name.value,
    geoLocation: geoLocation.value,
  });

  close();
  name.value = "";
  geoLocation.value = defaultGeoLocation;
};
</script>
