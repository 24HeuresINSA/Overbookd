<template>
  <DialogCard @close="close">
    <template #title> {{ typeFormLabel }} une catégorie </template>
    <template #content>
      <form>
        <v-text-field
          v-model="name"
          append-icon="mdi-label"
          label="Nom de la categorie"
          clearable
          outlined
          clear-icon="mdi-close-circle-outline"
          counter
          :rules="[rules.nameMinLength, rules.required]"
          @keydown.enter="confirmCategory"
        />
        <SearchTeam v-model="owner" label="Choisis l'équipe responsable" />
        <SearchCategory v-model="parent" label="Choisis un parent" />
      </form>
    </template>
    <template #actions>
      <v-btn
        color="primary"
        size="large"
        text="Sauvegarder la categorie"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :disabled="!canConfirmCategory"
        @click="confirmCategory"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { CatalogCategory, CategoryForm } from "@overbookd/http";
import type { Team } from "@overbookd/team";
import { minLength, required } from "~/utils/rules/input.rules";

const teamStore = useTeamStore();
const catalogStore = useCatalogStore();

const emit = defineEmits(["create", "update", "close"]);

const props = defineProps({
  category: {
    type: Object as PropType<CategoryForm>,
    default: () => null,
  },
});

const name = ref<string>("");
const owner = ref<Team | undefined>();
const parent = ref<CatalogCategory | undefined>();

const rules = { nameMinLength: minLength(3), required: required };

const isUpdate = computed<boolean>(() => props.category !== null);
const typeFormLabel = computed<string>(() =>
  isUpdate.value ? "Modifier" : "Ajouter",
);

const clearCategory = () => {
  name.value = "";
  owner.value = undefined;
  parent.value = undefined;
};

const setCategory = async () => {
  if (!props.category) return clearCategory();

  name.value = props.category.name;
  owner.value = props.category.owner
    ? await teamStore.getTeamByCode(props.category.owner)
    : undefined;
  parent.value = props.category.parent
    ? await catalogStore.getCategory(props.category.parent)
    : undefined;
};
watch(() => props.category, setCategory, { immediate: true });

const canConfirmCategory = computed<boolean>(() => name.value.trim() !== "");

const close = () => emit("close");
const confirmCategory = () => {
  if (!canConfirmCategory.value) return;

  const category: CategoryForm = {
    name: name.value.trim(),
    owner: owner.value?.code,
    parent: parent.value?.id,
  };

  if (isUpdate.value) emit("update", category);
  else emit("create", category);
  close();
  clearCategory();
};
</script>
