<template>
  <div class="bottom-action-bar__spacer" />
  <div ref="bar" class="bottom-action-bar" v-bind="$attrs">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { useElementSize } from "@vueuse/core";

defineOptions({ inheritAttrs: false });

const bar = useTemplateRef<HTMLElement>("bar");
const { height } = useElementSize(bar, undefined, { box: "border-box" });
const barHeight = computed<string>(() => `${height.value}px`);
</script>

<style lang="scss" scoped>
.bottom-action-bar {
  position: sticky;
  bottom: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  padding: 12px 16px;
  background-color: rgb(var(--v-theme-surface));
  border-radius: $main-page-border-radius;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);

  @media screen and (max-width: $mobile-max-width) {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
    flex-wrap: wrap;
    margin: 0;
    padding: 12px 16px calc($bottom-nav-height + 8px);
    border-radius: $main-page-border-radius $main-page-border-radius 0 0;
  }

  // Reserves the room hidden behind the fixed bar on mobile
  &__spacer {
    display: none;

    @media screen and (max-width: $mobile-max-width) {
      display: block;
      height: calc(v-bind(barHeight) - #{$bottom-nav-height});
    }
  }
}
</style>
