<template>
  <div v-if="editor" class="editor">
    <TiptapMenu class="editor__header" :editor="editor" :disabled="true">
      <template #additional-actions>
        <slot name="header" />
      </template>
    </TiptapMenu>
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
  computed: {
    emptyContent() {
      const html = this.editor.getHTML();
      const textContent = html.replace(/<[^>]+>/g, "");
      return textContent.trim() === "";
    },
  },
  watch: {
    data() {
      this.editor.commands.setContent(this.data ?? "");
      this.editor.setEditable(!this.disabled);
    },
  },
  mounted() {
    this.editor = new Editor({
      extensions: [StarterKit],
      content: this.data ?? "",
      editable: !this.disabled,
      onBlur: () => this.update(),
    });
  },
  beforeUnmount() {
    this.editor.destroy();
  },
  methods: {
    update() {
      this.$emit("change", this.emptyContent ? "" : this.editor.getHTML());
    },
  },
};
</script>

<style lang="scss">
.editor {
  background-color: #fff;
  border: 3px solid #7a7a7a;
  border-radius: 0.75rem;
  color: #0d0d0d;
  display: flex;
  flex-direction: column;
  max-height: 26rem;

  &__header {
    align-items: center;
    background: #7a7a7a;
    border-bottom: 3px solid #7a7a7a;
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
    padding: 5px;
    -webkit-overflow-scrolling: touch;
    .tiptap {
      min-height: 150px;
    }
  }
}

.disabled {
  opacity: 0.8;
}
</style>
