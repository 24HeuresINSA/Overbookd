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
          v-model="localSearchValue"
          label="Chercher une page"
          density="compact"
          variant="plain"
          class="navigation-search__input"
          hide-details
          single-line
          clearable
          @input="handleInput"
          @keydown.space.prevent="handleSpace"
        />
      </template>
    </v-list-item>
  </v-list>
</template>

<script lang="ts" setup>
defineProps({
  isFolded: {
    type: Boolean,
    required: true,
  },
});

const localSearchValue = ref("");

const searchValue = defineModel<string | undefined>("searchValue", {
  required: true,
});

const searchInput = defineModel<HTMLInputElement | null>("searchInput", {
  required: true,
});

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  searchValue.value = target.value;
};

const handleSpace = (event: KeyboardEvent) => {
  event.preventDefault();
  localSearchValue.value += " ";
  searchValue.value = localSearchValue.value;
};

const focusOnSearch = () => searchInput.value?.focus();

watch(searchValue, (newValue) => {
  localSearchValue.value = newValue || "";
});
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
