<template>
  <v-snackbar
    v-model="isShowing"
    :timeout="currentTimeout"
    :color="currentSnackColor"
    @update:model-value="updateDisplay"
  >
    {{ currentSnack?.message }}
    <template #actions>
      <v-btn text="Close" variant="text" @click="close" />
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ONE_SECOND_IN_MS } from "@overbookd/period";

const isShowing = ref<boolean>(false);
const store = useSnackNotificationStore();
const { queue } = storeToRefs(store);

const currentSnack = computed<SnackNotification | undefined>(() =>
  queue.value.at(0),
);
const currentTimeout = computed<number>(
  () => currentSnack.value?.timeout || DEFAULT_SNACK_TIMEOUT,
);
const currentSnackColor = computed<string>(() =>
  currentSnack.value?.type === "error" ? "#ab2a20" : "#3c8c3f",
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
