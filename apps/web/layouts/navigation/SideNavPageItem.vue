<template>
  <v-list-item
    :key="page.to"
    :to="page.to"
    :value="page.to"
    class="navigation-item"
    :class="{
      'navigation-item__current': isCurrent(page),
      'unfolded-item': !isFolded,
    }"
    link
    @click="propagateClick"
  >
    <template #prepend>
      <v-badge
        v-if="page.badgeValue"
        :content="page.badgeValue"
        color="tertiary"
      >
        <v-icon>{{ page.icon }}</v-icon>
      </v-badge>
      <v-icon v-else>{{ page.icon }}</v-icon>
    </template>

    <template #title>
      <span class="navigation-item__title">{{ page.title }}</span>
    </template>
  </v-list-item>
</template>

<script lang="ts" setup>
import type { PageInSummary } from "~/utils/navigation/pages/summary-pages";
import { findPage } from "~/utils/navigation/find-page.utils";

const route = useRoute();

defineProps({
  page: {
    type: Object as PropType<PageInSummary>,
    required: true,
  },
  isFolded: {
    type: Boolean,
    required: true,
  },
});

const isCurrent = ({ to }: PageInSummary): boolean => {
  const currentPage = findPage(route.path);
  return currentPage?.to === to;
};

const emit = defineEmits(["click"]);
const propagateClick = () => emit("click");
</script>

<style lang="scss" scoped>
@use "./side-nav-list.scss" as *;

.navigation-item {
  &__current {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }
}
</style>
