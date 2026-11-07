<template>
  <DialogCard @close="close">
    <template #title> Ajouter des instructions spécifiques </template>

    <template #subtitle>
      Ta FT est en attente de relecture. Pour ajouter des instructions
      spécifiques pour le·s responsable·s de la tâche, complète ces champs.
    </template>

    <template #content>
      <div class="d-flex flex-column ga-3">
      <SearchUsers
        v-model="volunteers"
        label="Responsable(s) de la tâche"
        closable-chips
        hide-details
      />

      <v-label>Instructions pour le·s responsable·s de la tâche</v-label>
      <RichEditor
        v-model="instruction"
        hide-details
      />
      </div>
    </template>

    <template #actions>
      <v-btn
        text="Ajouter des instructions"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :disabled="cantInit"
        size="large"
        @click="init"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import {
  type Adherent,
  InChargeInstructionsSpecification,
} from "@overbookd/festival-event";

const volunteers = ref<Adherent[]>([]);
const instruction = ref<string | undefined>();

const cantInit = computed<boolean>(() => {
  if (instruction.value === undefined) return true;
  return !InChargeInstructionsSpecification.isSatisfiedBy({
    volunteers: volunteers.value,
    instruction: instruction.value,
  });
});

const emit = defineEmits(["init", "close"]);
const close = () => {
  emit("close");
  volunteers.value = [];
  instruction.value = undefined;
};
const init = () => {
  if (!instruction.value?.trim()) return;
  const volunteersIds = volunteers.value.map(({ id }) => id);
  const form = { volunteers: volunteersIds, instruction: instruction.value };

  emit("init", form);
  close();
};
</script>
