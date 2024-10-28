<template>
  <nav class="mobile-only bottom-nav">
    <v-btn-group class="bottom-nav__buttons">
      <v-btn
        v-for="item in MOBILE_SUMMARY"
        :key="item.to"
        variant="plain"
        size="small"
        :disabled="isDisabled(item)"
        class="nav-btn"
        :class="{ 'nav-btn__selected': isSelected(item) }"
        @click="navigateTo(item.to)"
      >
        <div class="nav-btn__content">
          <v-icon class="nav-btn__icon">{{ item.icon }}</v-icon>
          <span class="nav-btn__label text-none">
            {{ item.shortTitle ?? item.title }}
          </span>
        </div>
      </v-btn>
    </v-btn-group>
  </nav>
</template>

<script lang="ts" setup>
import { MOBILE_SUMMARY } from "~/utils/navigation/pages/mobile-summary";
import type { PageInSummary } from "~/utils/navigation/pages/desktop-summary";
import { findPage } from "~/utils/navigation/find-page.utils";
import { navigateTo } from "#app";

const route = useRoute();
const userStore = useUserStore();

const isSelected = ({ to }: PageInSummary): boolean => {
  const currentPage = findPage(route.path);
  return currentPage?.to === to;
};
const isDisabled = ({ permission }: PageInSummary): boolean => {
  return !userStore.can(permission);
};
</script>

<style lang="scss" scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
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

  &__selected {
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
</style>
