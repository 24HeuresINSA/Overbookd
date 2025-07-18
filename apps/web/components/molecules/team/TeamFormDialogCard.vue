<template>
  <DialogCard @close="close">
    <template #title> {{ formLabel }} une équipe </template>
    <template #content>
      <form class="form">
        <v-text-field
          v-model="name"
          label="Nom"
          :rules="[rules.required]"
          hide-details
          required
        />
        <div class="color-picker">
          <label for="color-picker">Couleur</label>
          <v-color-picker
            id="color-picker"
            v-model="color"
            :rules="[rules.required]"
            hide-inputs
            required
          />
        </div>
        <v-text-field
          v-model="icon"
          label="Icône"
          prefix="mdi-"
          :rules="[rules.required]"
          required
        />
      </form>

      <div class="render">
        <h3>Aperçu :</h3>
        <v-chip :color="color" variant="elevated">
          <v-icon> mdi-{{ icon }} </v-icon>
          <span class="name"> {{ name }} </span>
        </v-chip>
      </div>
    </template>
    <template #actions>
      <v-btn
        :text="`${formLabel} l'équipe`"
        size="large"
        :disabled="!isValidForm"
        @click="createOrUpdateTeam"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { required } from "~/utils/rules/input.rules";
import { SlugifyService } from "@overbookd/slugify";
import type { Team } from "@overbookd/team";

const { team } = defineProps({
  team: {
    type: Object as PropType<Team>,
    default: () => undefined,
  },
});

const name = ref<string>();
const color = ref<string>("#000000");
const icon = ref<string>();
const rules = { required };

const isValidForm = computed<boolean>(() =>
  Boolean(name.value && color.value && icon.value),
);
const isCreateForm = computed<boolean>(() => team === undefined);
const formLabel = computed<string>(() =>
  isCreateForm.value ? "Créer" : "Modifier",
);

watch(
  () => team,
  (newTeam: Team | undefined) => {
    name.value = newTeam?.name ?? "";
    color.value = newTeam?.color ?? "#000000";
    icon.value = newTeam?.icon.replace("mdi-", "") ?? "";
  },
  { immediate: true },
);

const emit = defineEmits(["create", "update", "close"]);
const close = () => emit("close");
const createTeam = () => {
  const newTeam = {
    name: name.value,
    code: SlugifyService.applyOnOptional(name.value),
    color: color.value,
    icon: `mdi-${icon.value}`,
  };
  emit("create", newTeam);
  close();
};
const updateTeam = () => {
  const updatedTeam = {
    ...team,
    name: name.value,
    color: color.value,
    icon: `mdi-${icon.value}`,
  };
  emit("update", updatedTeam);
  close();
};
const createOrUpdateTeam = () => {
  if (isCreateForm.value) return createTeam();
  return updateTeam();
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .color-picker {
    align-self: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
  }
}

span.name {
  margin-left: 4px;
}

.render {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
