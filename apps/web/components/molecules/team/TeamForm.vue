<template>
  <v-card>
    <v-card-title class="title">
      <v-icon>mdi-account</v-icon>
      <span>{{ formLabel }} une équipe</span>
    </v-card-title>
    <v-card-text>
      <v-form class="form">
        <v-text-field
          v-model="name"
          label="Nom"
          :rules="[rules.required]"
          hide-details
          required
        />
        <label for="color-picker">Couleur</label>
        <v-color-picker
          id="color-picker"
          v-model="color"
          :rules="[rules.required]"
          hide-inputs
          required
        />
        <v-text-field
          v-model="icon"
          label="Icône"
          prefix="mdi-"
          :rules="[rules.required]"
          required
        />
      </v-form>

      <div class="render">
        <h3>Aperçu</h3>
        <v-chip :color="color" variant="elevated">
          <v-icon> mdi-{{ icon }} </v-icon>
          <span class="name"> {{ name }} </span>
        </v-chip>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn @click="close"> Annuler </v-btn>
      <v-spacer />
      <v-btn
        color="primary"
        :disabled="!isValidForm"
        @click="createOrUpdateTeam"
      >
        {{ formLabel }} l'équipe
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { required } from "~/utils/rules/input.rules";
import { SlugifyService } from "@overbookd/slugify";
import type { Team } from "@overbookd/http";
import { type PropType, watch } from "vue";

const emit = defineEmits(["create", "update", "close"]);

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

const isValidForm = computed(() =>
  Boolean(name.value && color.value && icon.value),
);
const isCreateForm = computed(() => team === undefined);
const formLabel = computed(() => (isCreateForm.value ? "Créer" : "Modifier"));

watch(
  () => team,
  (newTeam: Team | undefined) => {
    name.value = newTeam?.name ?? "";
    color.value = newTeam?.color ?? "#000000";
    icon.value = newTeam?.icon.replace("mdi-", "") ?? "";
  },
  { immediate: true },
);

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

<style lang="scss" scoped>
.title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

span.name {
  margin-left: 4px;
}

.render {
  display: flex;
  gap: 10px;
}
</style>