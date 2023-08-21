<template>
  <div class="px-2 stats-card" :class="displayedStatus" tile outlined>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "StatsCard",
  props: { status: { type: String, required: true } },
  computed: {
    displayedStatus() {
      return this.status.toLowerCase();
    },
  },
};
</script>
