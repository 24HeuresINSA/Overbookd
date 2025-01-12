<template>
  <OverCalendar />
</template>

<script lang="ts" setup>
import type { User } from "@overbookd/user";

defineProps({
  volunteer: {
    type: Object as () => User,
    required: true,
  },
});
</script>
