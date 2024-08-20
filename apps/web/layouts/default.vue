<template>
  <v-layout class="layout">
    <Header @update-nav="updateNav" />
    <SideNav
      v-model="isNavFolded"
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
import Header from "~/layouts/header/Header.vue";
import SideNav from "~/layouts/side-nav/SideNav.vue";
import { useTheme } from "vuetify";
import { pickDefaultTheme } from "~/utils/vuetify/theme/theme.utils";
import {
  isContentFlipped,
  saveContentFlipped,
  saveContentUnflipped,
} from "~/utils/easter-egg/flip-content";

const theme = useTheme();
onMounted(() => (theme.global.name.value = pickDefaultTheme()));

const userStore = useUserStore();

const isNavFolded = ref<boolean>(true);
const updateNav = () => (isNavFolded.value = !isNavFolded.value);

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
$main-border-radius: 25px;
$surface-color: rgb(var(--v-theme-surface));
$background-color: rgb(var(--v-theme-background));

.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.main {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;

  .fake-background {
    background: $surface-color;
    height: 100%;
    width: 100%;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 15px 25px;
    background: $background-color;
    overflow-y: auto;
    border-top-left-radius: $main-border-radius;
    border-top: 1px solid $background-color;
    border-left: 1px solid $background-color;

    @media only screen and (max-width: $mobile-max-width) {
      padding: 10px;
      border-top-right-radius: $main-border-radius;
      border-left: none;
    }
  }

  .flip {
    transform: rotate(180deg);
  }
}
</style>
