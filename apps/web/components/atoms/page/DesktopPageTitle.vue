<template>
  <div class="page-title-container" :class="{ 'desktop-only': desktopOnly }">
    <div class="page-title">
      <h1>{{ pageTitle }}</h1>
      <v-icon
        v-show="canBeFavorite"
        :icon="favoriteIcon"
        :aria-label="favoriteIconTitle"
        :title="favoriteIconTitle"
        color="primary"
        :class="{
          rotating: isRotating && !isShrinking,
          finalizing: isShrinking,
        }"
        @click="toggleFavorite"
      />
    </div>
    <div>
      <slot name="additional" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { isPageURL } from "@overbookd/web-page";
import { type Page, HOME_PAGE } from "~/utils/navigation/pages/summary-pages";
import { findPage } from "~/utils/navigation/find-page.utils";

const route = useRoute();
const preferenceStore = usePreferenceStore();

const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
  desktopOnly: {
    type: Boolean,
    default: true,
  },
});

const currentPage = computed<Page>(() => findPage(route.path) || HOME_PAGE);
const pageTitle = computed<string>(
  () => props.title || currentPage.value.title,
);
const canBeFavorite = computed<boolean>(() => currentPage.value.canBeFavorite);
const isFavorite = computed<boolean>(() =>
  preferenceStore.isPageFavorite(currentPage.value),
);
const favoriteIconTitle = computed<string>(() =>
  isFavorite.value ? "Retirer des favoris" : "Ajouter aux favoris",
);

const isStarFilled = ref<boolean>(isFavorite.value);
const favoriteIcon = computed<string>(() =>
  isStarFilled.value ? "mdi-star" : "mdi-star-outline",
);

const isRotating = ref<boolean>(false);
const isShrinking = ref<boolean>(false);

const toggleFavorite = async () => {
  const path = currentPage.value.to;
  if (!canBeFavorite.value || isRotating.value || !isPageURL(path)) return;

  isRotating.value = true;
  isFavorite.value
    ? await preferenceStore.removePageFromFavorites(path)
    : await preferenceStore.addPageToFavorites(path);
  isShrinking.value = true;

  setTimeout(() => (isStarFilled.value = isFavorite.value), 300);
  setTimeout(() => {
    isRotating.value = false;
    isShrinking.value = false;
  }, 600);
};
</script>

<style lang="scss" scoped>
.page-title-container {
  display: flex;
  flex-wrap: wrap;
  margin-left: 5px;
  margin-bottom: 10px;
  gap: 8px;
  @media screen and (max-width: $mobile-max-width) {
    justify-content: center;
  }
}

.page-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

h1 {
  font-size: 1.6rem;
  line-height: 1.2;
  font-weight: 600;
}

.v-icon {
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.2);
  }
  &.rotating {
    animation: rotating 0.8s linear infinite;
  }
  &.finalizing {
    animation: finalizing 0.6s ease forwards;
  }
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes finalizing {
  0% {
    transform: rotate(0deg) scale(1);
  }
  50% {
    transform: rotate(180deg) scale(0.3);
  }
  100% {
    transform: rotate(360deg) scale(1);
  }
}
</style>
