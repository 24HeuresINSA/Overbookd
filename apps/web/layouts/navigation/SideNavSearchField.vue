<template>
  <v-list class="navigation-list" density="compact" nav>
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
          v-model="searchFieldModel"
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
</template>

<script lang="ts" setup>
import { useDebounceFn } from "@vueuse/core";

defineProps({
  isFolded: {
    type: Boolean,
    required: true,
  },
});

const searchValue = defineModel<string | null>("searchValue", {
  required: true,
});
const searchInput = defineModel<HTMLInputElement | null>("searchInput", {
  required: true,
});
const focusOnSearch = () => searchInput.value?.focus();

const searchFieldModel = computed<string | null>({
  get: () => searchValue.value,
  set: (value) => updateSearchValue(value),
});

const updateSearchValue = useDebounceFn((search: string | null) => {
  searchValue.value = search;
}, 200);
</script>

<style lang="scss" scoped>
@use "./side-nav-list.scss" as *;

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
</style>
