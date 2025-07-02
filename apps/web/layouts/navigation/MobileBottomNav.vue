<template>
  <nav class="mobile-only bottom-nav">
    <v-btn-group class="bottom-nav__buttons">
      <v-btn
        v-for="page in mainPages"
        :key="page.to"
        variant="plain"
        size="small"
        :disabled="!hasPermissionFor(page)"
        class="nav-btn"
        :class="{ 'nav-btn__current': isCurrent(page) }"
        @click="navigateAndCloseMenu(page.to)"
      >
        <div class="nav-btn__content">
          <v-icon class="nav-btn__icon">{{ page.icon }}</v-icon>
          <span class="nav-btn__label text-none">
            {{ page.shortTitle ?? page.title }}
          </span>
        </div>
      </v-btn>

      <v-menu v-model="isMenuOpen">
        <template #activator="{ props }">
          <v-btn
            v-if="shouldDisplayMenuButton"
            v-bind="props"
            variant="plain"
            size="small"
            class="nav-btn"
            :class="{ 'nav-btn__current': isMenuOpen }"
          >
            <div class="nav-btn__content">
              <v-icon class="nav-btn__icon"> mdi-dots-horizontal </v-icon>
              <span class="nav-btn__label text-none"> Plus </span>
            </div>
          </v-btn>
        </template>
        <v-overlay v-model="isMenuOpen" class="overlay mobile-only">
          <v-list class="overlay__list">
            <SideNavPageItem
              v-for="page in otherNavigationPages"
              :key="page.to"
              :page="page"
              :is-folded="false"
              @click="navigateAndCloseMenu(page.to)"
            />
          </v-list>
        </v-overlay>
      </v-menu>
    </v-btn-group>
  </nav>
</template>

<script lang="ts" setup>
import SideNavPageItem from "./SideNavPageItem.vue";
import {
  ORGA_MOBILE_SUMMARY_WITHOUT_PLANNING,
  ORGA_MOBILE_SUMMARY_WITH_PLANNING,
  SUMMARY_PAGES,
  VOLUNTEER_MOBILE_SUMMARY,
  type PageInSummary,
} from "~/utils/navigation/pages/summary-pages";
import { findPage } from "~/utils/navigation/find-page.utils";
import { VIEW_ORGA_MOBILE_NAV, VIEW_PLANNING } from "@overbookd/permission";
import { PageFilter } from "~/utils/navigation/page.filter";
import { MY_PLANNING_PAGE } from "~/utils/navigation/pages/volunteer";

const route = useRoute();
const userStore = useUserStore();

const shouldDisplayOrgaNav = computed<boolean>(() =>
  userStore.can(VIEW_ORGA_MOBILE_NAV),
);
const shouldDisplayPlanning = computed<boolean>(() =>
  userStore.can(VIEW_PLANNING),
);
const mainPages = computed<PageInSummary[]>(() => {
  if (!shouldDisplayOrgaNav.value) return VOLUNTEER_MOBILE_SUMMARY;
  return shouldDisplayPlanning.value
    ? ORGA_MOBILE_SUMMARY_WITH_PLANNING
    : ORGA_MOBILE_SUMMARY_WITHOUT_PLANNING;
});

const otherNavigationPages = computed<PageInSummary[]>(() => {
  const notMain = SUMMARY_PAGES.filter(
    (page) => !mainPages.value.includes(page) && page !== MY_PLANNING_PAGE,
  );
  return PageFilter.from(notMain).withMobileSupport;
});

const shouldDisplayMenuButton = computed<boolean>(
  () => shouldDisplayOrgaNav.value && otherNavigationPages.value.length > 0,
);

const isMenuOpen = ref<boolean>(false);
const navigateAndCloseMenu = async (to: string) => {
  await navigateTo(to);
  isMenuOpen.value = false;
};

const isCurrent = ({ to }: PageInSummary): boolean => {
  const currentPage = findPage(route.path);
  return currentPage?.to === to;
};
const hasPermissionFor = ({ permission }: PageInSummary): boolean => {
  return userStore.can(permission);
};
</script>

<style lang="scss" scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  z-index: 100;
  height: $bottom-nav-height;
  width: 100vw;
  background: rgb(var(--v-theme-surface));
  border-top: 1px solid rgb(var(--v-theme-background));
  border-top-left-radius: $main-page-border-radius;
  border-top-right-radius: $main-page-border-radius;

  &__buttons {
    display: flex;
    justify-content: space-around;
    width: 100%;
    height: $bottom-nav-height;
    padding: 6px 0;
  }
}

.nav-btn {
  width: 60px;
  height: 100%;
  font-size: 0.75rem;
  cursor: pointer;
  padding: 2px;
  transition:
    background 0.2s,
    color 0.2s;

  &__current {
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }

  &__icon {
    font-size: 1.95rem;
  }

  &__label {
    font-size: 0.6rem;
  }
}

.overlay {
  z-index: 10 !important;
  display: flex;
  align-items: end;
  justify-content: flex-end;
  &__list {
    width: 70vw;
    min-width: 250px;
    padding-left: 5px;
    padding-bottom: calc($bottom-nav-height + 5px);
    border-radius: $field-border-radius;
  }
}
</style>
