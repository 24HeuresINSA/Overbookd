<template>
  <v-snackbar
    v-model="isShowing"
    :timeout="currentTimeout"
    :color="currentSnackColor"
    :location="snackLocation"
    :min-width="snackMinWidth"
    max-width="500"
    min-height="60"
    @update:model-value="updateDisplay"
  >
    <div class="snack-content">
      <v-icon
        v-show="currentSnackIcon"
        :icon="currentSnackIcon"
        size="x-large"
        class="snack-content__icon"
      />
      <span class="snack-content__text"> {{ currentSnack?.message }} </span>
    </div>
    <template #actions>
      <v-icon
        icon="mdi-close"
        variant="flat"
        class="close-icon"
        @click="close"
      />
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { ONE_SECOND_IN_MS } from "@overbookd/period";
import {
  type SnackNotification,
  DEFAULT_SNACK_TIMEOUT,
  SUCCESS,
  FAILURE,
  INFO,
} from "~/utils/notification/snack";
import { isDesktop as checkDesktop } from "~/utils/device/device.utils";

const themeStore = useThemeStore();
const isDarkTheme = computed<boolean>(() => themeStore.isDark);

const isShowing = ref<boolean>(false);
const store = useSnackNotificationStore();
const { queue } = storeToRefs(store);

const isDesktop = computed<boolean>(() => checkDesktop());
const snackLocation = computed<"bottom right" | "bottom">(() =>
  isDesktop.value ? "bottom right" : "bottom",
);
const snackMinWidth = computed<number | undefined>(() =>
  isDesktop.value ? 400 : undefined,
);

const currentSnack = computed<SnackNotification | undefined>(() =>
  queue.value.at(0),
);
const currentTimeout = computed<number>(
  () => currentSnack.value?.timeout || DEFAULT_SNACK_TIMEOUT,
);
const currentSnackColor = computed<string | undefined>(() => {
  const type = currentSnack.value?.type;
  if (!type) return;
  return isDarkTheme.value ? type : `${type}-lighten`;
});
const currentSnackIcon = computed<string | undefined>(() => {
  switch (currentSnack.value?.type) {
    case SUCCESS:
      return "mdi-check-circle";
    case FAILURE:
      return "mdi-close-circle";
    case INFO:
      return "mdi-information";
    default:
      return undefined;
  }
});

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

<style lang="scss" scoped>
.snack-content {
  display: flex;
  gap: 10px;
  align-items: center;
  &__text {
    font-size: 0.95rem;
  }
}

.close-icon {
  margin-right: 5px;
}

:deep(.v-snackbar__wrapper) {
  border-radius: 18px;
}
</style>
