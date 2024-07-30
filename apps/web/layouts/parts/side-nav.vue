<template>
  <aside>
    <nav>
      <nuxt-link
        v-for="page in filteredPages"
        :key="page.title"
        :to="page.to"
        class="page"
      >
        <v-badge
          v-if="badgeContent(page) > 0"
          :content="badgeContent(page)"
          :color="badgeColor(page)"
        >
          <v-icon>{{ page.icon }}</v-icon>
        </v-badge>
        <v-icon v-else>{{ page.icon }}</v-icon>
        <span class="page__title">{{ page.title }}</span>
      </nuxt-link>
    </nav>
    <div class="dialogs">
      <span class="dialog bug-report" @click="reportBug = true">
        <v-icon>mdi-bug</v-icon>
        <span class="dialog__title">Rapporter une erreur</span>
      </span>
      <span class="dialog ask-help" @click="askQuestion = true">
        <v-icon>mdi-help-circle-outline</v-icon>
        <span class="dialog__title">Une question ?</span>
      </span>
    </div>
    <v-dialog v-model="askQuestion" max-width="800px">
      <AskQuestionDialogCard @close="askQuestion = false" />
    </v-dialog>
    <v-dialog v-model="reportBug" max-width="800px">
      <BugReportDialogCard @close="reportBug = false" />
    </v-dialog>
  </aside>
</template>

<script lang="ts" setup>
import { pages, type Page } from "~/utils/pages/navigation";

const deviceStore = useDeviceStore();
const userStore = useUserStore();
const navigationBadgeStore = useNavigationBadgeStore();

onMounted(() => {
  navigationBadgeStore.fetchAll();
});

const askQuestion = ref<boolean>(false);
const reportBug = ref<boolean>(false);

const filteredPages = computed<Page[]>(() =>
  pages.filter(({ permission, mobileSupport }) => {
    const isSupportedByDevice = deviceStore.isDesktop || mobileSupport;
    const hasAccess = userStore.can(permission);
    return isSupportedByDevice && hasAccess;
  }),
);

const badgeContent = ({ to }: Page): number => {
  switch (to) {
    case "/fa":
      return navigationBadgeStore.myRefusedActivities;
    case "/registrations/staff":
      return navigationBadgeStore.recentStaffNewcomers;
    default:
      return 0;
  }
};
const badgeColor = (page: Page): string => {
  switch (page.to) {
    case "/fa":
      return "red";
    case "/registrations/staff":
      return "blue";
    default:
      return "grey";
  }
};
</script>

<style lang="scss" scoped>
$background-color: $white;

aside {
  position: fixed;
  box-shadow:
    0 2px 4px 0px rgba(0, 0, 0, 0.4),
    0 4px 5px 0 rgba(0, 0, 0, 0.34),
    0 1px 10px 0 rgba(0, 0, 0, 0.32);
  top: $header-height;
  z-index: 8;
  height: calc(100vh - #{$header-height});
  overflow-y: auto;
  background-color: $background-color;
  min-width: 35px;
  padding: 5px 0px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media only screen and (max-width: $mobile-max-width) {
    position: fixed;
    bottom: 0;
    top: unset;
    height: unset;
    width: 100%;
    .dialogs {
      border-left: 2px solid #756a46;
      display: flex;
    }
    .v-icon {
      font-size: 36px;
    }
  }
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: row;
  }
  &:hover {
    .page__title,
    .dialog__title {
      transition: max-width 0.5s;
      max-width: 200px;
    }
  }

  .dialog,
  .page {
    padding: 5px;
    display: flex;
    gap: 3px;
    &:hover {
      cursor: pointer;
      background-color: change-color(
        $color: $background-color,
        $blackness: 60%
      );
    }
    &__title {
      transition: max-width 0.5s;
      overflow: hidden;
      max-width: 0px;
      max-height: 24px;
      @media only screen and (max-width: $mobile-max-width) {
        display: none;
      }
    }
  }

  nav {
    display: flex;
    flex-direction: column;
    a {
      text-decoration: none;
      color: black;
    }
    @media only screen and (max-width: $mobile-max-width) {
      flex-direction: row;
      max-width: 80%;
      overflow-x: scroll;
      overflow-y: hidden;
    }
  }
}
</style>
~/utils/pages/list
