<template>
  <form class="filter">
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
import type { CatalogCategory, Team } from "@overbookd/http";

const name = defineModel<string>("name", { required: true });
const category = defineModel<CatalogCategory | undefined>("category", {
  required: true,
});
const team = defineModel<Team | undefined>("team", { required: true });

const emit = defineEmits(["update:name"]);
const updateName = (value: string) => emit("update:name", value);

const delay = ref<ReturnType<typeof setTimeout> | undefined>(undefined);
const defectNameUpdate = (name: string) => {
  if (delay.value) clearInterval(delay.value);
  delay.value = setTimeout(() => updateName(name), 800);
};
</script>

<style lang="scss">
.filter {
  display: flex;
  gap: 5%;
  justify-content: space-evenly;
  .v-input {
    flex-grow: 1;
  }
}
</style>
