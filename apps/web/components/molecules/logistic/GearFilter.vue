<template>
  <form class="filters">
    <v-text-field
      :model-value="search"
      label="Rechercher"
      autofocus
      clearable
      clear-icon="mdi-close-circle-outline"
      hide-details
      @update:model-value="defectSearchUpdate($event)"
    />
    <SearchCategory v-model="category" label="Catégorie" hide-details />
    <SearchTeam
      v-model:team="team"
      label="Equipe responsable"
      hide-details
      clearable
    />
    <slot name="additional-filters" />
  </form>
</template>

<script lang="ts" setup>
import type { CatalogCategory, GearSearchOptions } from "@overbookd/http";
import type { Team } from "@overbookd/team";

const emit = defineEmits(["update:search", "update:options"]);

const search = defineModel<string | undefined>("search", { required: true });
const category = defineModel<CatalogCategory | undefined>("category", {
  required: true,
});
const team = defineModel<Team | undefined>("team", { required: true });

const updateSearch = (value: string | null) =>
  emit("update:search", value ?? "");

const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const defectSearchUpdate = (search: string) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(() => updateSearch(search), 800);
};

const searchOptions = computed<GearSearchOptions>(() => {
  const validSearch = search.value?.trim() ? { search: search.value } : {};
  const validCategory = category.value ? { category: category.value.path } : {};
  const validTeam = team.value ? { owner: team.value.code } : {};
  return { ...validSearch, ...validCategory, ...validTeam };
});
watch(searchOptions, () => emit("update:options", searchOptions.value), {
  deep: true,
});
</script>

<style lang="scss" scoped>
.filters {
  width: 100%;
  display: flex;
  gap: 15px;
  justify-content: space-evenly;
  & > * {
    flex: 1;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: 10px;
  }
}
</style>
