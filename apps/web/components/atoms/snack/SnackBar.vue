<template>
  <v-snackbar
    v-model="isShowing"
    :timeout="currentTimeout"
    :color="currentSnackColor"
    @update:model-value="updateDisplay"
  >
    {{ currentSnack?.message }}
    <template #actions>
      <v-btn variant="text" @click="close">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ONE_SECOND_IN_MS } from "@overbookd/period";

const isShowing = ref(false);
const store = useSnackNotificationStore();
const { queue } = storeToRefs(store);

const currentSnack = computed(() => queue.value.at(0));
const currentTimeout = computed(
  () => currentSnack.value?.timeout || DEFAULT_SNACK_TIMEOUT,
);
const currentSnackColor = computed(() =>
  currentSnack.value?.type === "error" ? "red" : "green",
);

watch(
  queue,
  (newQueue) => {
    if (newQueue.length === 0) return (isShowing.value = false);
    if (!isShowing.value) isShowing.value = true;
  },
  { immediate: true },
);

const close = () => {
  isShowing.value = false;
  setTimeout(() => {
    store.popFirstNotification();
  }, ONE_SECOND_IN_MS / 5);
};

const updateDisplay = (isShowing: boolean) => {
  if (!isShowing) close();
};
</script>
