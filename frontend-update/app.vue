<template>
  <div>
    {{ user }}
  </div>
</template>

<script lang="ts">
import { useStore } from "~/store/common";

export default {
  name: "App",
  setup() {
    const store = useStore();
    store.user.setFirstname("John");
    return {
      user: store.user.fullName,
    };
  },
};
</script>
