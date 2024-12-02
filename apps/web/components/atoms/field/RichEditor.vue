<template>
  <div class="rich-editor">
    <div :id="editorId" />
  </div>
</template>

<script lang="ts" setup>
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";
import { nanoid } from "nanoid";

Quill.register({});

const { readonly } = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
});

const content = defineModel<string>({ required: false });

const options: QuillOptions = {
  theme: "snow",
  readOnly: readonly,
  modules: {
    toolbar: [
      [{ header: 1 }, { header: 2 }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  },
};

const editorId = `editor-${nanoid()}`;
const quill = ref<Quill | undefined>();

onMounted(() => {
  const editorElement = document.getElementById(editorId);
  if (!editorElement) return;

  quill.value = new Quill(editorElement, options);
  quill.value.root.innerHTML = content.value ?? "";
  quill.value.on("text-change", () => {
    content.value = quill.value?.root.innerHTML ?? "";
  });
});

watch(content, (newContent) => {
  if (!quill.value) return;
  const currentContent = quill.value.root.innerHTML;
  if (newContent === currentContent) return;
  quill.value.root.innerHTML = newContent ?? "";
});

onUnmounted(() => {
  quill.value?.off("text-change");
});
</script>

<style lang="scss" scoped>
$toolbar-icon-color: rgba(var(--v-theme-on-surface), 0.8);
$border-color: rgba(var(--v-border-color), 0.3);

.rich-editor {
  :deep(.ql-fill) {
    fill: $toolbar-icon-color;
  }
  :deep(.ql-stroke) {
    stroke: $toolbar-icon-color;
  }
  :deep(.ql-toolbar) {
    border-top-left-radius: $field-border-radius;
    border-top-right-radius: $field-border-radius;
    border-color: $border-color;
  }
  :deep(.ql-container) {
    border-bottom-left-radius: $field-border-radius;
    border-bottom-right-radius: $field-border-radius;
    border-color: $border-color;
  }
}
</style>
