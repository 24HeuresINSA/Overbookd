<template>
  <div class="px-2 stats-card" :class="color()" tile outlined>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: { status: { type: String, required: true } },
  methods: {
    color() {
      return "bg-" + this.status.toLowerCase();
    },
  },
};
</script>
