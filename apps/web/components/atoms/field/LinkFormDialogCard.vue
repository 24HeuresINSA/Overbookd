<template>
  <DialogCard  @close="close">
    <template #title>
      <v-icon icon="mdi-link-variant" class="mr-2" />
      {{ edit ? "Modifier le lien" : "Ajouter un lien" }}
    </template>

    <template #content>
      <v-form ref="form" @submit.prevent="addLink">
        <v-text-field
          v-model="href"
          label="Lien"
          placeholder="https://www.youtube.com/watch?v=s0CBAmDSGLg"
          :rules="[required, isUrl]"
          class="mb-2"
        />
        <v-text-field
          v-model="text"
          label="Texte affiché (optionnel)"
          placeholder="Lien"
        />
      </v-form>
    </template>

    <template #actions>
      <v-btn text="Annuler" color="secondary" @click="close" />
      <v-btn
        v-if="edit"
        text="Retirer le lien"
        color="tertiary"
        @click="removeLink"
      />
      <v-btn
        text="Valider"
        color="primary"
        :disabled="!href"
        @click="addLink"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import { isUrl, required } from "~/utils/rules/input.rules";

const href = defineModel<string>("href", { default: "" });
const text = defineModel<string | undefined>("text");

defineProps({
  edit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["add", "remove", "close"]);

const form = useTemplateRef("form");

const addLink = async () => {
  if (!form.value) return;
  const { valid } = await form.value.validate();
  if (!valid) return;
  emit("add", { href: href.value, text: text.value || href.value });
  close();
};

const removeLink = () => {
  emit("remove");
  close();
};

const close = () => {
  emit("close");
  href.value = "";
  text.value = undefined;
};
</script>
