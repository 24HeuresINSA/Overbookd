<template>
  <div v-if="editor" class="editor">
    <TiptapMenu class="editor__header" :editor="editor" :disabled="true" />
    <EditorContent
      class="editor__content"
      :class="{ disabled: disabled }"
      :editor="editor"
    />
  </div>
</template>

<script>
import StarterKit from "@tiptap/starter-kit";
import { Editor, EditorContent } from "@tiptap/vue-2";

import TiptapMenu from "./TiptapMenu.vue";

export default {
  name: "RichEditor",
  components: {
    EditorContent,
    TiptapMenu,
  },
  props: {
    data: {
      type: String,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      editor: null,
    };
  },
  watch: {
    data() {
      //this.editor.commands.setContent(this.data ?? "");
      this.editor.setEditable(!this.disabled);
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: "<u>hello world</u>",
      editable: !this.disabled,
      onBlur: () => this.update(),
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  methods: {
    update() {
      this.$emit("change", this.editor.getHTML());
    },
  },
};
</script>

<style lang="scss">
.editor {
  background-color: #fff;
  border: 3px solid #424242;
  border-radius: 0.75rem;
  color: #0d0d0d;
  display: flex;
  flex-direction: column;
  max-height: 26rem;

  &__header {
    align-items: center;
    background: #424242;
    border-bottom: 3px solid #424242;
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
    display: flex;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
  }

  &__content {
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem 1rem 0 1rem;
    -webkit-overflow-scrolling: touch;
  }
}

.disabled {
  opacity: 0.8;
}
</style>
