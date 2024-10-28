<template>
  <DialogCard @close="close">
    <template #title> {{ formLabel }} un créneau </template>

    <template #content>
      <div class="form">
        <v-text-field v-model="name" label="Nom" :rules="[required]" />
        <v-text-field v-model="description" label="Description" />
        <DateTimeField v-model="start" label="Début" :step="60" />
        <DateTimeField
          v-model="end"
          label="Fin"
          :error-messages="periodErrors"
          :step="60"
        />
        <v-text-field
          v-model="charisma"
          type="number"
          label="Charisme par heure"
          :rules="[isNumber, min(0)]"
        />
      </div>
    </template>

    <template #actions>
      <v-btn
        :text="`${formLabel} le créneau`"
        color="primary"
        size="large"
        :disabled="cantSaveCharismaPeriod"
        @click="confirmCharismaPeriod"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { CharismaPeriod, SavedCharismaPeriod } from "@overbookd/http";
import { Period } from "@overbookd/time";
import { isNumber, min, required } from "~/utils/rules/input.rules";

const configurationStore = useConfigurationStore();
const charismaPeriodStore = useCharismaPeriodStore();

const props = defineProps({
  charismaPeriod: {
    type: Object as PropType<SavedCharismaPeriod>,
    default: undefined,
  },
});

const name = ref<string>(props.charismaPeriod?.name ?? "");
const description = ref<string>(props.charismaPeriod?.description ?? "");
const start = ref<Date>(
  props.charismaPeriod?.start ?? configurationStore.eventStartDate,
);
const end = ref<Date>(
  props.charismaPeriod?.end ?? configurationStore.eventStartDate,
);
const charisma = ref<string>(props.charismaPeriod?.charisma?.toString() ?? "0");

const isEditForm = computed<boolean>(() => props.charismaPeriod !== undefined);
const formLabel = computed<string>(() =>
  isEditForm.value ? "Modifier" : "Ajouter",
);

const charismaPeriods = computed<SavedCharismaPeriod[]>(
  () => charismaPeriodStore.all,
);

const periodErrors = computed<string[]>(() =>
  Period.errors({ start: start.value, end: end.value }),
);
const hasOverlap = computed<boolean>(() =>
  charismaPeriods.value.some((cp) => {
    if (isEditForm.value && cp.id === props.charismaPeriod?.id) return false;
    const period = Period.init({ start: start.value, end: end.value });
    return period.isOverlapping(Period.init(cp));
  }),
);
const cantSaveCharismaPeriod = computed<boolean>(() => {
  const hasName = !!name.value.trim();
  const hasCharisma = !!charisma.value.trim() && +charisma.value >= 0;
  const isPeriodValid = Period.isValid({ start: start.value, end: end.value });
  if (!hasName || !hasCharisma || !isPeriodValid) return true;
  return hasOverlap.value;
});

const emit = defineEmits(["create", "update", "close"]);

const close = () => emit("close");

const addCharismaPeriod = () => {
  const charismaPeriod: CharismaPeriod = {
    name: name.value,
    description: description.value,
    start: start.value,
    end: end.value,
    charisma: +charisma.value,
  };
  emit("create", charismaPeriod);
};
const updateCharismaPeriod = () => {
  const charismaPeriod: SavedCharismaPeriod = {
    id: props.charismaPeriod?.id ?? 0,
    name: name.value,
    description: description.value,
    start: start.value,
    end: end.value,
    charisma: +charisma.value,
  };
  emit("update", charismaPeriod);
};
const confirmCharismaPeriod = () => {
  if (cantSaveCharismaPeriod.value) return;
  if (isEditForm.value) return updateCharismaPeriod();
  return addCharismaPeriod();
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
