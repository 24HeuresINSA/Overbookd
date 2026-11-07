<template>
  <v-input
    ref="input"
    :model-value
    :hint
    :persistent-hint
    :hide-details
    :rules
    :messages
    :error-messages
    indent-details
  >
    <template #default="{ isValid }">
      <div
        class="v-field v-field--variant-outlined d-flex flex-column w-100"
        :class="{
          'v-field--focused': focused,
          'v-field--error': isValid.value === false || unsaved,
        }"
      >
        <ClientOnly>
          <v-toolbar>
            <div class="input-content w-100 d-flex ga-2">
              <div class="d-flex flex-wrap">
                <template
                  v-for="(group, groupIndex) in toolbarGroups"
                  :key="groupIndex"
                >
                  <v-divider
                    v-if="groupIndex > 0"
                    vertical
                    inset
                    class="mx-1"
                  />

                  <div>
                    <v-btn
                      v-for="(button, buttonIndex) in group"
                      :key="buttonIndex"
                      :aria-label="button.title"
                      :title="button.title"
                      variant="text"
                      density="comfortable"
                      :color="button.isActive?.() ? 'primary' : undefined"
                      :disabled="readonly || button.isDisabled?.()"
                      icon
                      rounded
                      @click="button.onClick"
                    >
                      <v-icon :icon="button.icon" size="small" />
                    </v-btn>
                  </div>
                </template>
              </div>
            </div>

            <div class="v-field__outline toolbar-separator" />
          </v-toolbar>
        </ClientOnly>

        <EditorContent :editor class="input-content editor" />

        <div class="v-field__outline">
          <div class="v-field__outline__start" />
          <div class="v-field__outline__end" />
        </div>
      </div>

      <v-dialog v-model="isLinkDialogOpen" max-width="600">
        <LinkFormDialogCard
          v-model:href="linkHref"
          v-model:text="linkText"
          :edit="hasActiveLink"
          @add="setLink"
          @remove="removeLink"
          @close="isLinkDialogOpen = false"
        />
      </v-dialog>
    </template>
  </v-input>
</template>

<script lang="ts" setup>
import StarterKit from "@tiptap/starter-kit";
import { EditorContent, useEditor } from "@tiptap/vue-3";

type ValidationRule = (value: string | null | undefined) => boolean | string;

const { readonly } = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  unsaved: {
    type: Boolean,
    default: false,
  },
  hint: {
    type: String,
    default: undefined,
  },
  persistentHint: {
    type: Boolean,
    default: false,
  },
  hideDetails: {
    type: [Boolean, String] as PropType<boolean | "auto">,
    default: undefined,
  },
  rules: {
    type: Array<ValidationRule>,
    default: () => [],
  },
  messages: {
    type: Array<string>,
    default: () => [],
  },
  errorMessages: {
    type: Array<string>,
    default: () => [],
  },
});

const content = defineModel<string>({ required: false });

const focused = ref<boolean>(false);

const fixLineBreaks = (htmlContent: string) =>
  htmlContent.replace(/<p><\/p>/g, "<p><br></p>");

const normalizeEmptyParagraphs = (htmlContent: string) =>
  htmlContent.replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, "<p></p>");

const editor = useEditor({
  content: normalizeEmptyParagraphs(content.value ?? ""),
  editable: !readonly,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2] },
      link: { openOnClick: false },
    }),
  ],
  onUpdate: ({ editor }) => {
    content.value = fixLineBreaks(editor.getHTML());
  },
  onFocus: () => {
    focused.value = true;
  },
  onBlur: () => {
    focused.value = false;
  },
});

const input = useTemplateRef("input");
const exposedIsValid = computed(() => input.value?.isValid);
defineExpose({
  isValid: exposedIsValid,
  validate: () => input.value?.validate(),
  resetValidation: () => input.value?.resetValidation(),
});

watch(
  () => readonly,
  (readonly) => editor.value?.setEditable(!readonly),
);

watch(content, (newContent) => {
  const editorInstance = editor.value;
  if (!editorInstance) return;
  const currentContent = editorInstance.getHTML();
  const normalizedNewContent = normalizeEmptyParagraphs(newContent ?? "");
  if (normalizedNewContent === currentContent) return;
  editorInstance.commands.setContent(normalizedNewContent, {
    emitUpdate: false,
  });
});

type ToolbarButton = {
  icon: string;
  title: string;
  onClick: () => void;
  isActive?: () => boolean;
  isDisabled?: () => boolean;
};

const toolbarGroups = computed<ToolbarButton[][]>(() => [
  [
    {
      icon: "mdi-undo",
      title: "Annuler",
      onClick: () => editor.value?.chain().focus().undo().run(),
      isDisabled: () => !editor.value?.can().undo(),
    },
    {
      icon: "mdi-redo",
      title: "Rétablir",
      onClick: () => editor.value?.chain().focus().redo().run(),
      isDisabled: () => !editor.value?.can().redo(),
    },
  ],
  [
    {
      icon: "mdi-format-header-1",
      title: "Titre 1",
      onClick: () =>
        editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => !!editor.value?.isActive("heading", { level: 1 }),
    },
    {
      icon: "mdi-format-header-2",
      title: "Titre 2",
      onClick: () =>
        editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => !!editor.value?.isActive("heading", { level: 2 }),
    },
  ],
  [
    {
      icon: "mdi-format-bold",
      title: "Gras",
      onClick: () => editor.value?.chain().focus().toggleBold().run(),
      isActive: () => !!editor.value?.isActive("bold"),
    },
    {
      icon: "mdi-format-italic",
      title: "Italique",
      onClick: () => editor.value?.chain().focus().toggleItalic().run(),
      isActive: () => !!editor.value?.isActive("italic"),
    },
    {
      icon: "mdi-format-underline",
      title: "Souligné",
      onClick: () => editor.value?.chain().focus().toggleUnderline().run(),
      isActive: () => !!editor.value?.isActive("underline"),
    },
  ],
  [
    {
      icon: "mdi-format-list-numbered",
      title: "Liste numérotée",
      onClick: () => editor.value?.chain().focus().toggleOrderedList().run(),
      isActive: () => !!editor.value?.isActive("orderedList"),
    },
    {
      icon: "mdi-format-list-bulleted",
      title: "Liste à puces",
      onClick: () => editor.value?.chain().focus().toggleBulletList().run(),
      isActive: () => !!editor.value?.isActive("bulletList"),
    },
  ],
  [
    {
      icon: "mdi-link-variant-plus",
      title: "Ajouter un lien",
      onClick: openLinkDialog,
      isActive: () => hasActiveLink.value,
    },
  ],
  [
    {
      icon: "mdi-format-clear",
      title: "Effacer la mise en forme",
      onClick: () =>
        editor.value?.chain().focus().unsetAllMarks().clearNodes().run(),
    },
  ],
]);

const hasActiveLink = computed<boolean>(() => !!editor.value?.isActive("link"));

const isLinkDialogOpen = ref<boolean>(false);
const linkHref = ref<string>("");
const linkText = ref<string | undefined>(undefined);
const savedSelection = ref<{ from: number; to: number } | null>(null);

const openLinkDialog = () => {
  const editorInstance = editor.value;
  if (!editorInstance) return;

  if (editorInstance.isActive("link")) {
    editorInstance.chain().extendMarkRange("link").run();
  }

  const { from, to } = editorInstance.state.selection;
  savedSelection.value = { from, to };

  linkHref.value = editorInstance.getAttributes("link").href ?? "";
  linkText.value = editorInstance.state.doc.textBetween(from, to) || undefined;

  isLinkDialogOpen.value = true;
};

const setLink = ({ href, text }: { href: string; text: string }) => {
  const editorInstance = editor.value;
  if (!editorInstance || !savedSelection.value) {
    isLinkDialogOpen.value = false;
    return;
  }
  const { from, to } = savedSelection.value;
  editorInstance
    .chain()
    .focus()
    .setTextSelection({ from, to })
    .deleteSelection()
    .insertContent({
      type: "text",
      text,
      marks: [{ type: "link", attrs: { href } }],
    })
    .run();
  isLinkDialogOpen.value = false;
};

const removeLink = () => {
  editor.value?.chain().focus().unsetLink().run();
  isLinkDialogOpen.value = false;
};
</script>

<style lang="scss" scoped>
.v-field {
  border-radius: $field-border-radius;
}

.input-content {
  padding-inline: var(--v-field-padding-start) var(--v-field-padding-end);
}

.toolbar-separator {
  border: 0 solid currentColor;
  opacity: var(--v-field-border-opacity);
  border-bottom-width: var(--v-field-border-width);
}

:deep(.v-toolbar__content) {
  height: fit-content !important;
  padding: 4px 0;
}

.editor {
  padding-bottom: var(--v-field-input-padding-bottom);
  min-height: 100px;
}

.editor :deep(.tiptap) {
  height: 100%;
  display: flow-root;
  outline: none;
  padding-top: 10px;

  ul,
  ol {
    padding-left: 1.5em;
  }
}

.raw-markdown-editor :deep(.v-field__outline) {
  --v-field-border-width: 0;
}
</style>
