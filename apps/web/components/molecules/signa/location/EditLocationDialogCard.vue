<template>
  <DialogCard @close="close">
    <template #title>Modifier le lieu</template>
    <template #content>
      <v-text-field v-model="name" label="Nom du lieu" />
      <LocationMapEditor v-model="geoLocation" />
    </template>
    <template #actions>
      <v-btn
        text="Modifier le lieu"
        size="large"
        :disabled="noChange"
        @click="editLocation"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { SignaLocation } from "@overbookd/signa";
import type { GeoLocation } from "@overbookd/geo-location";

const locationStore = useLocationStore();

const props = defineProps({
  location: {
    type: Object as PropType<SignaLocation>,
    required: true,
  },
});

const name = ref<string>(props.location.name);
const geoLocation = ref<GeoLocation | null>(props.location.geoLocation);

const noChange = computed<boolean>(() => {
  const sameName = name.value === props.location.name || name.value === "";
  const sameLocation = geoLocation.value === props.location.geoLocation;
  return sameName && sameLocation;
});

const emit = defineEmits(["close"]);
const close = () => emit("close");

const editLocation = async () => {
  if (noChange.value) return;
  await locationStore.editLocation({
    ...props.location,
    name: name.value,
    geoLocation: geoLocation.value,
  });

  close();
};
</script>
