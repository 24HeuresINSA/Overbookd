<template>
  <v-list-item
    :key="page.to"
    :to="page.to"
    :value="page.to"
    class="navigation-item"
    :class="{
      'navigation-item__selected': isSelected(page),
      'unfolded-item': !isFolded,
    }"
    link
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
import { findPage, type PageInSummary } from "~/utils/pages/navigation";

const route = useRoute();

const { page, isFolded } = defineProps({
  page: {
    type: Object as PropType<PageInSummary>,
    required: true,
  },
  isFolded: {
    type: Boolean,
    required: true,
  },
});

const isSelected = ({ to }: PageInSummary): boolean => {
  const currentPage = findPage(route.path);
  return currentPage?.to === to;
};
</script>

<style lang="scss" scoped>
@import "./side-nav-list.scss";

.navigation-item {
  &__selected {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }
}
</style>
