<template>
  <form class="filters">
    <v-text-field
      :model-value="name"
      label="Nom du matos"
      autofocus
      clearable
      clear-icon="mdi-close-circle-outline"
      hide-details
      @update:model-value="defectNameUpdate($event)"
    />
    <SearchCategory v-model="category" label="Catégorie" hide-details />
    <SearchTeam
      v-model="team"
      label="Equipe responsable"
      hide-details
      clearable
    />
  </form>
</template>

<script lang="ts" setup>
import type { CatalogCategory, GearSearchOptions } from "@overbookd/http";
import type { Team } from "@overbookd/team";

const emit = defineEmits(["update:name", "update:options"]);

const name = defineModel<string | undefined>("name", { required: true });
const category = defineModel<CatalogCategory | undefined>("category", {
  required: true,
});
const team = defineModel<Team | undefined>("team", { required: true });

const updateName = (value: string | null) => emit("update:name", value ?? "");

const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const defectNameUpdate = (name: string) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(() => updateName(name), 800);
};

const searchOptions = computed<GearSearchOptions>(() => {
  const validName = name.value?.trim() ? { name: name.value } : {};
  const validCategory = category.value ? { category: category.value.path } : {};
  const validTeam = team.value ? { owner: team.value.code } : {};
  return { ...validName, ...validCategory, ...validTeam };
});
watch(searchOptions, () => emit("update:options", searchOptions.value), {
  deep: true,
});
</script>

<style lang="scss" scoped>
.filters {
  display: flex;
  gap: 15px;
  justify-content: space-evenly;
  .v-input {
    flex-grow: 1;
  }
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    gap: 5px;
  }
}
</style>
