<template>
  <v-layout class="layout">
    <Header />
    <DesktopSideNav
      @flip-content="flipContent"
      @unflip-content="unflipContent"
    />
    <v-main class="main">
      <div class="fake-background">
        <div class="content" :class="{ flip: shouldFlipContent }">
          <slot />
        </div>
      </div>
    </v-main>
    <MobileBottomNav />

    <v-dialog
      v-model="shouldApproveEULA"
      transition="dialog-bottom-transition"
      max-width="600"
      persistent
    >
      <ApproveEULADialogCard />
    </v-dialog>
  </v-layout>
</template>

<script lang="ts" setup>
import { PERMISSION_GRANTED } from "@overbookd/access-manager";
import { addEventListener } from "@overbookd/domain-events";
import { useTheme } from "vuetify";
import Header from "~/layouts/header/Header.vue";
import DesktopSideNav from "~/layouts/navigation/DesktopSideNav.vue";
import MobileBottomNav from "~/layouts/navigation/MobileBottomNav.vue";
import {
  isContentFlipped,
  saveContentFlipped,
  saveContentUnflipped,
} from "~/utils/easter-egg/flip-content";
import { pickDefaultTheme } from "~/utils/vuetify/theme/theme.utils";

const theme = useTheme();
const auth = useAuthStore();
const config = useRuntimeConfig();
const liveNotificationEndpoint = computed<string>(() => {
  const path = `${config.public.baseURL}/notifications/live`;
  const liveEndpoint = new URL(path);
  liveEndpoint.searchParams.append("token", auth.accessToken);
  return liveEndpoint.href;
});

const notificationSource = ref<EventSource | undefined>(undefined);

onMounted(() => {
  theme.global.name.value = pickDefaultTheme();
  const source = new EventSource(liveNotificationEndpoint.value);
  notificationSource.value = source;
  addEventListener(source, PERMISSION_GRANTED, (notification) =>
    console.log(notification),
  );
});

onUnmounted(() => {
  notificationSource.value?.close();
});

const userStore = useUserStore();

const shouldApproveEULA = computed<boolean>(
  () => userStore.loggedUser?.hasApprovedEULA === false,
);

const shouldFlipContent = ref<boolean>(isContentFlipped());
const flipContent = () => {
  shouldFlipContent.value = true;
  saveContentFlipped();
};
const unflipContent = () => {
  shouldFlipContent.value = false;
  saveContentUnflipped();
};
</script>

<style lang="scss" scoped>
$surface-color: rgb(var(--v-theme-surface));
$background-color: rgb(var(--v-theme-background));

.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  @media only screen and (max-width: $mobile-max-width) {
    background: $background-color;
  }
}

.main {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @media only screen and (max-width: $mobile-max-width) {
    padding-bottom: $bottom-nav-height;
  }

  .fake-background {
    background: $surface-color;
    height: 100%;
    width: 100%;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: $desktop-content-vertical-padding
      $desktop-content-horizontal-padding;
    background: $background-color;
    overflow-y: auto;
    border-top-left-radius: $main-page-border-radius;
    border-top: 1px solid $background-color;
    border-left: 1px solid $background-color;

    @media only screen and (max-width: $mobile-max-width) {
      padding: $mobile-content-padding;
      border-top-right-radius: $main-page-border-radius;
      border-left: none;
    }
  }

  .flip {
    transform: rotate(180deg);
  }
}
</style>
