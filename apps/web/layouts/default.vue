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
import {
  PERMISSION_GRANTED,
  PERMISSION_REVOKED,
  TEAMS_JOINED,
  TEAM_LEFT,
} from "@overbookd/access-manager";
import {
  FESTIVAL_ACTIVITY_APPROVED,
  FESTIVAL_ACTIVITY_READY_TO_REVIEW,
  FESTIVAL_ACTIVITY_REJECTED,
} from "@overbookd/domain-events";
import { CANDIDATE_ENROLLED } from "@overbookd/registration";
import { useTheme } from "vuetify";
import { useLiveNotification } from "~/composable/useLiveNotification";
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
const { mine } = useLiveNotification();
const userStore = useUserStore();
const { refreshTokens } = useAuthStore();
const { fetchMyRefusedActivities } = useNavigationBadgeStore();

onMounted(() => {
  theme.global.name.value = pickDefaultTheme();
  mine.listen(PERMISSION_GRANTED, () => refreshTokens());
  mine.listen(PERMISSION_REVOKED, () => refreshTokens());
  mine.listen(TEAMS_JOINED, () => refreshTokens());
  mine.listen(TEAM_LEFT, () => refreshTokens());
  mine.listen(CANDIDATE_ENROLLED, () => refreshTokens());
  mine.listen(FESTIVAL_ACTIVITY_REJECTED, () => fetchMyRefusedActivities());
  mine.listen(FESTIVAL_ACTIVITY_READY_TO_REVIEW, () =>
    fetchMyRefusedActivities(),
  );
  mine.listen(FESTIVAL_ACTIVITY_APPROVED, () => fetchMyRefusedActivities());
});

onUnmounted(() => {
  mine.stopListening();
});

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
