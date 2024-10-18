<template>
  <v-list
    class="navigation-list navigation-pages"
    :class="{ 'hide-scrollbar': isFolded }"
    density="compact"
    nav
  >
    <SideNavPageItem
      v-for="page in favoritePages"
      :key="page.to"
      :page="page"
      :is-folded="isFolded"
    />
    <v-divider v-show="favoritePages.length > 0" class="divider" />
    <SideNavPageItem
      v-for="page in nonFavoritePages"
      :key="page.to"
      :page="page"
      :is-folded="isFolded"
    />
  </v-list>
</template>

<script lang="ts" setup>
import SideNavPageItem from "./SideNavPageItem.vue";
import { PageFilter } from "~/utils/navigation/page.filter";
import {
  summaryPages,
  type PageInSummary,
} from "~/utils/navigation/pages/page-list";
import { FA_URL, REGISTRATIONS_STAFF_URL } from "@overbookd/web-page";

const navigationBadgeStore = useNavigationBadgeStore();

const props = defineProps({
  isFolded: {
    type: Boolean,
    required: true,
  },
  search: {
    type: String,
    default: "",
  },
});

const pagesWithBadge = computed<PageInSummary[]>(() => {
  const { myRefusedActivities, recentStaffNewcomers } = navigationBadgeStore;
  return summaryPages.map((page) => {
    switch (page.to) {
      case FA_URL:
        return { ...page, badgeValue: myRefusedActivities };
      case REGISTRATIONS_STAFF_URL:
        return { ...page, badgeValue: recentStaffNewcomers };
      default:
        return page;
    }
  });
});

const filteredPages = computed<PageInSummary[]>(() =>
  PageFilter.from(pagesWithBadge.value).matching(props.search),
);

const favoritePages = computed<PageInSummary[]>(
  () => PageFilter.from(filteredPages.value).favorites,
);
const nonFavoritePages = computed<PageInSummary[]>(
  () => PageFilter.from(filteredPages.value).nonFavorites,
);
</script>

<style lang="scss" scoped>
@import "./side-nav-list.scss";

$navigation-search-height: 63px;
$navigation-item-height: 50px;
$help-items-height: $navigation-item-height * 2 + $divider-bottom-height;

.navigation-pages {
  overflow-y: auto !important;
  max-height: calc(
    100vh - $header-height - $navigation-search-height - $help-items-height
  );
  padding-top: 2px;
  padding-bottom: 2px;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--v-theme-primary)) rgb(var(--v-theme-surface));

  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 7px;
    background: rgb(var(--v-theme-primary));
  }
}

.hide-scrollbar {
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
