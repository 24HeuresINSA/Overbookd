<template>
  <v-avatar
    :size="size"
    :image="picture"
    icon="mdi-account-circle"
    class="user-avatar"
  />
</template>

<script lang="ts" setup>
const { size } = defineProps({
  picture: {
    type: String,
    default: undefined,
  },
  size: {
    type: Number,
    default: 32,
  },
});

// mdi-account-circle glyph has inner padding, same ratio as ProfilePicture
const iconSize = computed<string>(() => `${Math.round(size * 1.15)}px`);
</script>

<style lang="scss" scoped>
.user-avatar :deep(.v-icon) {
  font-size: v-bind(iconSize);
  opacity: 0.8;
}
</style>
