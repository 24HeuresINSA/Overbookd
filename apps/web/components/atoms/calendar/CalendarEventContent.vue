<template>
  <div class="name">{{ name }}</div>
  <div class="hour">{{ hour }}</div>
</template>

<script lang="ts" setup>
defineProps({
  name: {
    type: String,
    required: true,
  },
  hour: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.name {
  font-size: 0.85rem;
  font-weight: bold;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 5px;
}

.hour {
  font-size: 0.75rem;
  line-height: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
