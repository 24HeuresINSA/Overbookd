<template>
  <RichEditor
    :model-value="instructions"
    :scope="scope"
    :readonly="readonly"
    :unsaved="unsaved"
    class="editor"
    @update:model-value="updateInstructions"
  />

  <div class="actions">
    <v-btn
      v-if="canForceInstruction"
      text="Sauvegarde forcée"
      color="primary"
      :disabled="!unsaved"
      @click="forceSave"
    />
    <v-btn
      v-if="canSave"
      text="Sauvegarder"
      color="primary"
      :disabled="!unsaved"
      @click="save"
    />
  </div>
</template>

<script lang="ts" setup>
const instructions = defineModel<string>({ required: true });

defineProps({
  scope: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  canSave: {
    type: Boolean,
    defaul: true,
  },
  canForceInstruction: {
    type: Boolean,
    defaul: false,
  },
});

const modifiedInstructions = ref<string>("");
const unsaved = computed(() => {
  return instructions.value !== modifiedInstructions.value;
});

const updateInstructions = (newInstructions: string) => {
  modifiedInstructions.value = newInstructions.trim();
};

watch(
  () => instructions.value,
  () => (modifiedInstructions.value = instructions.value),
  { immediate: true },
);

const emit = defineEmits(["save", "force-save"]);

const save = () => emit("save", modifiedInstructions.value);
const forceSave = () => emit("force-save", modifiedInstructions.value);
</script>

<style lang="scss" scoped>
.editor {
  margin: 6px 0;
}

.actions {
  margin-right: 10px;
  display: flex;
  gap: 25px;
  justify-content: right;

  @media only screen and (max-width: $mobile-max-width) {
    margin: 0 0 10px 0;
    flex-direction: column;
    gap: 5px;
  }
}
</style>
