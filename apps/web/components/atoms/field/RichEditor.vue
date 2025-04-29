<template>
  <div class="rich-editor" :class="{ unsaved }">
    <div :id="id" />
  </div>
</template>

<script lang="ts" setup>
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

Quill.register({});

const props = defineProps({
  scope: {
    type: String,
    required: true,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  unsaved: {
    type: Boolean,
    default: false,
  },
});

const content = defineModel<string>({ required: false });
const id = computed<string>(() => `editor-${props.scope}`);

const options: QuillOptions = {
  theme: "snow",
  readOnly: props.readonly,
  modules: {
    toolbar: [
      [{ header: 1 }, { header: 2 }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  },
};

const quill = computed(() => new Quill(`#${id.value}`, options));

const fixLineBreaks = (htmlContent: string) =>
  htmlContent.replace(/<p><\/p>/g, "<p><br></p>");

onMounted(() => {
  const delta = quill.value.clipboard.convert({ html: content.value ?? "" });
  quill.value.setContents(delta, "silent");
  quill.value.on("text-change", () => {
    content.value = fixLineBreaks(quill.value.getSemanticHTML());
  });
});

watch(content, (newContent) => {
  if (!quill.value) return;
  const currentContent = fixLineBreaks(quill.value.getSemanticHTML());
  if (newContent === currentContent) return;
  const delta = quill.value.clipboard.convert({ html: content.value ?? "" });
  quill.value.setContents(delta, "silent");
});

onUnmounted(() => {
  quill.value?.off("text-change");
});
</script>

<style lang="scss" scoped>
$toolbar-icon-color: rgba(var(--v-theme-on-surface), 0.8);

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
  }
  :deep(.ql-container) {
    border-bottom-left-radius: $field-border-radius;
    border-bottom-right-radius: $field-border-radius;
  }
}

.unsaved {
  :deep(.ql-toolbar) {
    border-color: rgba(var(--v-theme-error), 0.6);
    border-width: 3px;
  }
  :deep(.ql-container) {
    border-color: rgba(var(--v-theme-error), 0.6);
    border-width: 3px;
  }
}
</style>
