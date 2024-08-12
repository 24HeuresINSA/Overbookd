<template>
  <v-navigation-drawer
    :model-value="isDisplayed"
    :rail="isReducedForDesktop"
    expand-on-hover
    rail-width="60"
    width="300"
    floating
    :mobile="!isDesktop"
    class="navigation"
    @update:model-value="updateMobileDisplay"
    @update:rail="updateDesktopReduction"
  >
    <v-list class="navigation__list" density="compact" nav>
      <v-list-item
        class="navigation-search"
        :class="{ 'unfolded-item': !isFolded }"
        link
        @click="focusOnSearch"
      >
        <template #prepend>
          <v-icon>mdi-magnify</v-icon>
        </template>
        <template #title>
          <v-text-field
            ref="searchInput"
            v-model="search"
            label="Chercher une page"
            density="compact"
            variant="plain"
            class="navigation-search__input"
            hide-details
            single-line
            clearable
          />
        </template>
      </v-list-item>
    </v-list>

    <v-list
      class="navigation__list navigation-pages"
      :class="{ 'hide-scrollbar': isFolded }"
      density="compact"
      nav
    >
      <v-list-item
        v-for="page in filteredPages"
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
            v-if="badgeContent(page)"
            :content="badgeContent(page)"
            :color="badgeColor(page)"
          >
            <v-icon>{{ page.icon }}</v-icon>
          </v-badge>
          <v-icon v-else>{{ page.icon }}</v-icon>
        </template>

        <template #title>
          <span class="navigation-item__title">{{ page.title }}</span>
        </template>
      </v-list-item>
    </v-list>

    <v-list class="navigation__list help-items" density="compact" nav>
      <v-divider class="divider" />
      <v-list-item
        prepend-icon="mdi-help-circle"
        class="navigation-item"
        :class="{ 'unfolded-item': !isFolded }"
        link
        @click="openAskQuestionDialog"
      >
        <template #title>
          <span class="navigation-item__title">Besoin d'aide ?</span>
        </template>
      </v-list-item>
      <v-list-item
        prepend-icon="mdi-bug"
        class="navigation-item"
        :class="{ 'unfolded-item': !isFolded }"
        link
        @click="openReportBugDialog"
      >
        <template #title>
          <span class="navigation-item__title">Signaler un bug</span>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-dialog v-model="askQuestion" max-width="600">
    <AskQuestionDialogCard @close="closeAskQuestionDialog" />
  </v-dialog>

  <v-dialog v-model="reportBug" max-width="800">
    <BugReportDialogCard @close="closeReportBugDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
import { SlugifyService } from "@overbookd/slugify";
import { summaryPages, type PageInSummary } from "~/utils/pages/navigation";
import { isDesktop as checkDesktop } from "~/utils/device/device.utils";
import {
  shouldFlipContent,
  shouldUnflipContent,
} from "~/utils/easter-egg/flip-content";

const route = useRoute();
const userStore = useUserStore();
const navigationBadgeStore = useNavigationBadgeStore();

onMounted(() => navigationBadgeStore.fetchAll());

const isDesktop = checkDesktop();

const searchInput = ref<HTMLInputElement | null>(null);
const focusOnSearch = () => searchInput.value?.focus();
const unfocusOnSearch = () => searchInput.value?.blur();

const isFolded = defineModel<boolean>({ required: true });
const isDisplayed = computed<boolean>(() => isDesktop || !isFolded.value);
const isReducedForDesktop = computed<boolean | null>(() =>
  isDesktop ? isFolded.value : null,
);
const updateMobileDisplay = (value: boolean) => (isFolded.value = !value);
const updateDesktopReduction = (value: boolean) => {
  isFolded.value = value;
  unfocusOnSearch();
};

const pagesForDevice = computed<PageInSummary[]>(() =>
  summaryPages.filter(({ permission, mobileSupport }) => {
    const isSupportedByDevice = isDesktop || mobileSupport;
    const hasAccess = userStore.can(permission);
    return isSupportedByDevice && hasAccess;
  }),
);

const search = ref<string | undefined>(undefined);
const filteredPages = computed<PageInSummary[]>(() => {
  const slugifiedSearch = SlugifyService.applyOnOptional(search.value);
  if (!slugifiedSearch?.trim()) return pagesForDevice.value;

  return pagesForDevice.value.filter(({ keywords }) =>
    keywords.some((keyword) => keyword.includes(slugifiedSearch)),
  );
});

const askQuestion = ref<boolean>(false);
const openAskQuestionDialog = () => (askQuestion.value = true);
const closeAskQuestionDialog = () => (askQuestion.value = false);

const reportBug = ref<boolean>(false);
const openReportBugDialog = () => (reportBug.value = true);
const closeReportBugDialog = () => (reportBug.value = false);

const isSelected = ({ to }: PageInSummary): boolean => {
  if (to === "/") return route.path === to;
  return route.path.includes(to);
};

const badgeContent = ({ to }: PageInSummary): number => {
  switch (to) {
    case "/fa":
      return navigationBadgeStore.myRefusedActivities;
    case "/registrations/staff":
      return navigationBadgeStore.recentStaffNewcomers;
    default:
      return 0;
  }
};
const badgeColor = (page: PageInSummary): string => {
  switch (page.to) {
    case "/fa":
      return "tertiary";
    case "/registrations/staff":
    default:
      return "secondary";
  }
};

const emit = defineEmits(["flip-content", "unflip-content"]);
watch(search, (newValue) => {
  if (shouldFlipContent(newValue)) return emit("flip-content");
  if (shouldUnflipContent(newValue)) return emit("unflip-content");
});
</script>

<style lang="scss" scoped>
$navigation-search-height: 63px;
$navigation-item-height: 50px;
$divider-bottom-height: 5px;
$help-items-height: $navigation-item-height * 2 + $divider-bottom-height;
$navigation-item-margin-horizontal: 5px;
$navigation-item-unfolded-margin-right: 15px;

.navigation {
  .v-icon {
    padding-left: 4px;
  }

  &__list {
    padding-left: 3px;
    padding-right: 3px;
  }
}

.navigation-search {
  margin: 0 $navigation-item-margin-horizontal 5px;
  padding: 2px 8px;
  border-radius: 10px;
  background: rgb(var(--v-theme-background));
  transition: margin-right 0.3s;
  cursor: pointer;
  &__input {
    padding-bottom: 6px;
  }
}

.navigation-pages {
  overflow-y: auto !important;
  max-height: calc(
    100vh - $header-height - $navigation-search-height - $help-items-height
  );
  padding-top: 2px;
  padding-bottom: 2px;
  &::-webkit-scrollbar {
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background: rgb(var(--v-theme-primary));
  }
}
.hide-scrollbar {
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.navigation-item {
  border-radius: 10px;
  margin: 0 $navigation-item-margin-horizontal;
  transition:
    background-color 0.3s,
    margin-right 0.3s;

  &__title {
    font-size: 1rem;
  }
  &__selected {
    background: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
  }
  &:not(.navigation-item__selected):hover {
    background: rgb(var(--v-theme-primary-lighten));
    color: rgb(var(--v-theme-on-primary));
  }
}

.unfolded-item {
  margin-right: $navigation-item-unfolded-margin-right;
}

.help-items {
  position: fixed;
  bottom: 0;
  width: 100%;
}

.divider {
  margin-left: $navigation-item-margin-horizontal;
  margin-right: $navigation-item-margin-horizontal;
  margin-bottom: 4px;
}
</style>
