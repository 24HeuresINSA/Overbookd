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
      @click="propagateClick"
    />
    <v-divider
      v-show="favoritePages.length > 0 && nonFavoritePages.length > 0"
      :thickness="2"
      class="divider"
    />
    <SideNavPageItem
      v-for="page in nonFavoritePages"
      :key="page.to"
      :page="page"
      :is-folded="isFolded"
      @click="propagateClick"
    />
  </v-list>
</template>

<script lang="ts" setup>
import {
  SUMMARY_PAGES,
  type PageInSummary,
} from "~/utils/navigation/pages/summary-pages";
import SideNavPageItem from "./SideNavPageItem.vue";
import {
  FA_URL,
  FT_URL,
  REGISTRATIONS_STAFF_URL,
  REGISTRATIONS_VOLUNTEER_URL,
} from "@overbookd/web-page";
import { PageFilter } from "~/utils/navigation/page.filter";

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
  const {
    myRefusedActivities,
    myRefusedTasks,
    staffCandidates,
    volunteerCandidates,
  } = navigationBadgeStore;
  return SUMMARY_PAGES.map((page) => {
    switch (page.to) {
      case FA_URL:
        return { ...page, badgeValue: myRefusedActivities };
      case FT_URL:
        return { ...page, badgeValue: myRefusedTasks };
      case REGISTRATIONS_STAFF_URL:
        return { ...page, badgeValue: staffCandidates };
      case REGISTRATIONS_VOLUNTEER_URL:
        return { ...page, badgeValue: volunteerCandidates };
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

const emit = defineEmits(["click"]);
const propagateClick = () => emit("click");
</script>

<style lang="scss" scoped>
@use "./side-nav-list.scss" as *;

$navigation-search-height: 63px;
$navigation-item-height: 50px;
$divider-height: 2px + $divider-margin-bottom;
$help-items-height: $navigation-item-height * 2 + $divider-height;

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
