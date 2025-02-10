<template>
  <div class="rich-editor" :style="editorStyle">
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

const editorStyle = computed(() => ({
  "--border-color": props.unsaved
    ? "rgb(var(--v-theme-error))"
    : "rgba(var(--v-border-color), 0.3)",
}));

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

const quill = ref<Quill | undefined>();

onMounted(() => {
  quill.value = new Quill(`#${id.value}`, options);
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
    border-color: var(--border-color);
  }
  :deep(.ql-container) {
    border-bottom-left-radius: $field-border-radius;
    border-bottom-right-radius: $field-border-radius;
    border-color: var(--border-color);
  }
}
</style>
