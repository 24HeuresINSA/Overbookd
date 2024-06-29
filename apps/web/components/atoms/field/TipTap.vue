<template>
  <VuetifyTiptap
    v-model="content"
    :label="props.title"
    :extensions="extensions"
    rounded
  />
</template>

<script lang="ts" setup>
import { VuetifyTiptap } from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";
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
} from "vuetify-pro-tiptap";

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

const content = defineModel<string>();
</script>
