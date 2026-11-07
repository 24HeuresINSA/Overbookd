<template>
  <div v-html-safe="content" class="tiptap" />
</template>

<script lang="ts" setup>
defineProps({
  content: {
    type: String as PropType<string | null>,
    default: "",
  },
});
</script>

<style lang="scss" src="~/assets/tiptap.scss" />
