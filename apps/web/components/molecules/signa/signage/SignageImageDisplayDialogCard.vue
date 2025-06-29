<template>
  <v-card class="signage">
    <v-btn
      class="close-btn"
      icon="mdi-close"
      aria-label="Fermer"
      title="Fermer"
      @click="close"
    />
    <img :src="image" :alt="`${signage.name} image`" />
  </v-card>
</template>

<script lang="ts" setup>
import { signageTypes } from "@overbookd/festival-event";
import type { SignageWithPotentialImage } from "~/utils/logistic/signage";

const catalogSignageStore = useCatalogSignageStore();

const props = defineProps({
  signage: {
    type: Object as PropType<SignageWithPotentialImage>,
    default: () => ({
      name: "",
      type: signageTypes.AFFICHE,
    }),
  },
});

const image = computed<string | undefined>(
  () => catalogSignageStore.signage?.imageBlob,
);

watch(
  () => props.signage,
  (signage: SignageWithPotentialImage) => {
    if (signage.id) catalogSignageStore.fetchSignageImage(signage);
  },
  { immediate: true },
);

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.signage {
  padding: 20px;
  img {
    max-width: 95vw;
    max-height: 90vh;
  }
  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
