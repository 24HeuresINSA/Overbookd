<template>
  <RichEditor
    v-model="instructions"
    :scope="scope"
    :readonly="readonly"
    :unsaved="unsaved"
    class="editor"
  />

  <div class="actions">
    <v-btn
      v-if="canForceInstruction"
      text="Sauvegarde forcée"
      color="secondary"
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

const props = defineProps({
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
    default: true,
  },
  canForceInstruction: {
    type: Boolean,
    default: false,
  },
  savedInstructions: {
    type: String,
    required: true,
  },
});

const unsaved = computed(() => {
  return instructions.value !== props.savedInstructions;
});

const emit = defineEmits(["save", "force-save"]);

const save = () => emit("save");
const forceSave = () => emit("force-save");
</script>

<style lang="scss" scoped>
.editor {
  margin: 6px 0;
}

.actions {
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
