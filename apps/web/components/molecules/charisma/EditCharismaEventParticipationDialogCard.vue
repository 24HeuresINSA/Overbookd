<template>
  <DialogCard @close="close">
    <template #title> Modifier la participation </template>

    <template #subtitle>
      Participation de
      <strong>{{ participation.participant.firstname }}</strong> à l'événement
      "<strong>{{ participation.name }}</strong
      >" le <strong>{{ formattedDate }}</strong> pour
      <strong>{{ participation.charisma }}</strong> de charisme
    </template>

    <template #content>
      <v-text-field
        :model-value="newCharisma"
        label="Charisme"
        type="number"
        :rules="[required, isNumber, isInteger, min(1)]"
        @update:model-value="updateCharisma"
      />
    </template>

    <template #actions>
      <v-btn
        text="Modifier la participation"
        size="large"
        variant="elevated"
        color="primary"
        rounded
        :disabled="cantEdit"
        @click="editParticipation"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { CharismaEventParticipation } from "@overbookd/charisma";
import { formatDate } from "@overbookd/date";
import { required, min, isNumber, isInteger } from "~/utils/rules/input.rules";

const { participation } = defineProps({
  participation: {
    type: Object as PropType<CharismaEventParticipation>,
    required: true,
  },
});

const newCharisma = ref<number>(participation.charisma);
const updateCharisma = (value: string) => (newCharisma.value = +value);
const cantEdit = computed<boolean>(
  () => !newCharisma.value || newCharisma.value <= 0,
);

const formattedDate = computed<string>(() =>
  formatDate(new Date(participation.eventDate)),
);

const emit = defineEmits(["edit", "close"]);
const close = () => emit("close");
const editParticipation = () => {
  if (cantEdit.value) return;
  emit("edit", newCharisma.value);
};
</script>
