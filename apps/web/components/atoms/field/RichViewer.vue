<template>
  <div v-html-safe="content" class="rich-viewer" />
</template>

<script lang="ts" setup>
defineProps({
  content: {
    type: String as PropType<string | null>,
    default: "",
  },
});
</script>

<style scoped>
.rich-viewer :deep(ul), .rich-viewer :deep(ol) {
    padding-left: 1.5em;
}
</style>
