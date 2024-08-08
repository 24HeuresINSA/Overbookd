<template>
  <v-app class="layout">
    <Header />
    <div class="side-with-main">
      <SideNav
        v-model="isNavFolded"
        @flip-content="flipContent"
        @unflip-content="unflipContent"
      />
      <div class="main" :class="{ 'full-main': isNavFolded }">
        <div class="content" :class="{ flip: shouldFlipContent }">
          <slot />
        </div>
      </div>
    </div>

    <v-dialog
      v-model="shouldApproveEULA"
      transition="dialog-bottom-transition"
      max-width="600"
      persistent
    >
      <ApproveEULADialogCard />
    </v-dialog>
  </v-app>
</template>

<script lang="ts" setup>
import Header from "~/layouts/parts/Header.vue";
import SideNav from "~/layouts/parts/SideNav.vue";
import { useTheme } from "vuetify";
import { pickRandomTheme } from "~/utils/theme/theme.utils";
import {
  isContentFlipped,
  saveContentFlipped,
  saveContentUnflipped,
} from "~/utils/easter-egg/flip-content";

const theme = useTheme();
onMounted(() => (theme.global.name.value = pickRandomTheme()));

const userStore = useUserStore();

const isNavFolded = ref<boolean>(true);

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
$navigation-folded-width: 70px;
$navigation-unfolded-width: 300px;

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.side-with-main {
  flex: 1;
  display: flex;
  min-height: calc(100% - #{$header-height});

  .main {
    display: flex;
    justify-content: space-between;
    flex-direction: column;
    margin-left: $navigation-unfolded-width;
    width: calc(100% - $navigation-unfolded-width);
    transition: margin-left 0.2s;
    background: rgb(var(--v-theme-surface));

    .content {
      background: rgb(var(--v-theme-background));
      height: 100%;
      border-radius: 25px 0 0 0;
      padding: 15px 25px;
    }

    .flip {
      transform: rotate(180deg);
    }
  }
  .full-main {
    margin-left: $navigation-folded-width;
    width: calc(100% - $navigation-folded-width);
  }

  @media only screen and (max-width: $mobile-max-width) {
    .main {
      margin-left: 0;
      width: 100%;
      .content {
        border-radius: 0;
      }
    }
  }
}
</style>
