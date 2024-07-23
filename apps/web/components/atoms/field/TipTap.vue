<template>
  <VuetifyTiptap
    v-model="content"
    :label="props.title"
    :extensions="extensions"
    rounded
  />
</template>

<script lang="ts" setup>
import {
  BaseKit,
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  Highlight,
  Heading,
  Table,
  History,
  VuetifyTiptap,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";

const extensions = [
  BaseKit.configure({
    placeholder: {
      placeholder: "Ecris ton texte ici...",
    },
  }),
  Bold,
  Italic,
  Underline,
  Strike,
  Color,
  Highlight,
  Heading,
  Table,
  History,
];

const props = defineProps({
  title: {
    type: String,
    default: undefined,
  },
});

const content = defineModel<string>({ required: false });
</script>
