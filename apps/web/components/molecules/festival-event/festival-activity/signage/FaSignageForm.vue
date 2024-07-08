<template>
  <DialogCard @close="close">
    <template #title> {{ typeFormLabel }} une signalétique </template>
    <template #content>
      <v-select
        v-model="type"
        type="select"
        label="Type *"
        :items="signageTypeValues"
        :rules="[rules.required]"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        v-model="text"
        label="Texte à écrire *"
        :rules="[rules.required]"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        :model-value="quantity"
        label="Quantité *"
        type="number"
        :rules="[rules.number, rules.min, rules.required]"
        @update:model-value="updateQuantity"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        v-model="size"
        label="Taille *"
        :rules="[rules.required]"
        @keydown.enter="confirmSignage"
      />
      <v-text-field
        v-model="comment"
        label="Commentaire"
        @keydown.enter="confirmSignage"
      />
    </template>

    <template #actions>
      <v-btn
        :text="`${typeFormLabel} la signalétique`"
        prepend-icon="mdi-checkbox-marked-circle-outline"
        :disabled="!canConfirmSignage"
        color="success"
        variant="elevated"
        @click="confirmSignage"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { type Signage, PANNEAU, signageTypes } from "@overbookd/festival-event";
import { isNumber, min, required } from "~/utils/rules/input.rules";

const emit = defineEmits(["add", "update", "close"]);

const props = defineProps({
  signage: {
    type: Object as PropType<Signage | null>,
    default: () => null,
  },
});

const type = ref<Signage["type"]>(PANNEAU);
const text = ref<string>("");
const quantity = ref<number>(1);
const size = ref<string>("");
const comment = ref<string | null>(null);
const updateQuantity = (value: string) => (quantity.value = +value);

const isUpdate = computed<boolean>(() => props.signage !== null);
const typeFormLabel = computed<string>(() =>
  isUpdate.value ? "Modifier" : "Ajouter",
);

const rules = { number: isNumber, min: min(1), required };
const signageTypeValues = Object.values(signageTypes);

const clearSignage = () => {
  type.value = PANNEAU;
  text.value = "";
  quantity.value = 1;
  size.value = "";
  comment.value = null;
};
const setSignage = () => {
  if (!props.signage) return clearSignage();

  type.value = props.signage.type;
  text.value = props.signage.text;
  quantity.value = props.signage.quantity;
  size.value = props.signage.size;
  comment.value = props.signage.comment;
};
watch(() => props.signage, setSignage, { immediate: true });

const canConfirmSignage = computed(() => {
  const hasType = type.value !== null;
  const hasAtLeastOne = quantity.value > 0;
  const hasText = text.value.trim() !== "";
  const hasSize = size.value.trim() !== "";
  return hasType && hasAtLeastOne && hasText && hasSize;
});
const close = () => emit("close");
const confirmSignage = () => {
  if (!canConfirmSignage.value) return;

  const commentValue = comment.value?.trim();
  const signage = {
    type: type.value,
    text: text.value.trim(),
    quantity: quantity.value,
    size: size.value.trim(),
    comment: commentValue || null,
  };

  if (isUpdate.value) {
    emit("update", { ...signage, id: props.signage?.id });
  } else {
    emit("add", signage);
  }
  close();
  clearSignage();
};
</script>
