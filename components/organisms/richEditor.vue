<template>
  <ClientOnly>
    <!-- Use the component in the right place of the template -->
    <TiptapVuetify
      v-model="content"
      :aria-disabled="disabled"
      :extensions="extensions"
      :toolbar-attributes="{ color: 'black', dark: true }"
    />

    <template #placeholder> Loading... </template>
  </ClientOnly>
</template>

<script>
// import the component and the necessary extensions
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History,
} from "tiptap-vuetify";

export default {
  name: "RichEditor",
  // specify TiptapVuetify component in "components"
  components: { TiptapVuetify },
  props: ["data", "disabled"],
  data: () => ({
    // declare extensions you want to use
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3],
          },
        },
      ],
      Bold,
      Link,
      Code,
      HorizontalRule,
      Paragraph,
      HardBreak,
    ],
    // starting editor's content
    content: undefined,
  }),
  watch: {
    content() {
      this.$emit("change", this.content);
    },
    data: function () {
      this.content = this.data;
    },
  },
  mounted() {
    this.content = this.data;
  },
};
</script>
