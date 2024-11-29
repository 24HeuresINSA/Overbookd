<template>
  <v-card class="settings">
    <v-card-title>Nouvel événement</v-card-title>
    <v-card-text class="settings__form">
      <v-text-field
        v-model="name"
        label="Nom de l'événement"
        :rules="[required]"
      />
      <DateField v-model="date" label="Date de l'événement" />
      <v-text-field
        :model-value="charismaPerHour"
        label="Charisme par heure"
        type="number"
        :rules="[required, isNumber, isInteger, min(1)]"
        @update:model-value="updateCharismaPerHour"
      />
    </v-card-text>
    <v-card-actions>
      <v-btn
        text="Sauvegarder"
        size="large"
        class="settings__save-button"
        :disabled="cantSave"
        @click="save"
      />
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import type { CharismaEventParticipant } from "~/utils/charisma/charisma-event";
import { required, isInteger, isNumber, min } from "~/utils/rules/input.rules";

const name = defineModel<string>("name", { required: true });
const date = defineModel<Date>("date", { required: true });
const charismaPerHour = defineModel<number>("charismaPerHour", {
  required: true,
});

const props = defineProps({
  participants: {
    type: Array as PropType<CharismaEventParticipant[]>,
    required: true,
  },
});

const updateCharismaPerHour = (value: string) => {
  charismaPerHour.value = +value;
};

const cantSave = computed<boolean>(() => {
  const invalidName = !name.value.trim();
  const invalidDate = !date.value;
  const invalidCharisma = !charismaPerHour.value || charismaPerHour.value <= 0;
  const hasNoParticipants = props.participants.length === 0;
  return invalidName || invalidDate || invalidCharisma || hasNoParticipants;
});

const emit = defineEmits(["save"]);
const save = () => emit("save");
</script>

<style lang="scss" scoped>
.settings {
  height: fit-content;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-top: 10px;
    padding-bottom: 0;
  }

  &__save-button {
    width: calc(100% - $card-margin * 2);
    margin: 0 5px;
  }
}
</style>
