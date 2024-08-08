<template>
  <v-navigation-drawer
    v-model:rail="isFolded"
    expand-on-hover
    rail-width="70"
    width="300"
    floating
    :mobile="false"
    class="navigation"
    @update:rail="unfocusOnSearch"
  >
    <v-list density="compact" nav>
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
      density="compact"
      class="navigation-pages"
      :class="{ 'hide-scrollbar': isFolded }"
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
            v-if="isFolded && badgeContent(page)"
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

        <template #append>
          <v-badge
            v-if="!isFolded && badgeContent(page)"
            :content="badgeContent(page)"
            :color="badgeColor(page)"
            inline
          />
        </template>
      </v-list-item>
    </v-list>

    <v-list density="compact" class="help-items" nav>
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
import { pages, type Page } from "~/utils/pages/navigation";
import { isDesktop } from "~/utils/device/device.utils";
import {
  shouldFlipContent,
  shouldUnflipContent,
} from "~/utils/easter-egg/flip-content";

const route = useRoute();
const userStore = useUserStore();
const navigationBadgeStore = useNavigationBadgeStore();

onMounted(() => {
  navigationBadgeStore.fetchAll();
});

const isFolded = defineModel<boolean>({ required: true });

const pagesForDevice = computed<Page[]>(() =>
  pages.filter(({ permission, mobileSupport }) => {
    const isSupportedByDevice = isDesktop() || mobileSupport;
    const hasAccess = userStore.can(permission);
    return isSupportedByDevice && hasAccess;
  }),
);

const searchInput = ref<HTMLInputElement | null>(null);
const focusOnSearch = () => searchInput.value?.focus();
const unfocusOnSearch = () => searchInput.value?.blur();

const search = ref<string | undefined>(undefined);
const filteredPages = computed<Page[]>(() => {
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

const isSelected = ({ to }: Page): boolean => {
  if (to === "/") return route.path === to;
  return route.path.includes(to);
};

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
$text-field-height: 60px;
$navigation-search-margin-bottom: 5px;
$navigation-search-height: $text-field-height + $navigation-search-margin-bottom;
$navigation-item-height: 50px;
$divider-height: 9px;
$help-items-height: $navigation-item-height * 2 + $divider-height;
$navigation-item-margin-horizontal: 5px;
$navigation-item-unfolded-margin-right: 15px;

.navigation {
  margin-top: $header-height;
  @media only screen and (max-width: $mobile-max-width) {
    display: none;
  }
  .v-icon {
    padding-left: 3px;
  }
}

.navigation-search {
  margin: 0 $navigation-item-margin-horizontal $navigation-search-margin-bottom;
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
  bottom: $header-height;
  width: 100%;
}

.divider {
  margin: 4px $navigation-item-margin-horizontal;
}
</style>
