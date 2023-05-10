<template>
  <div>
    {{ user }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "./store/user";

export default defineComponent({
  name: "App",
  setup() {
    const userStore = useUserStore();
    userStore.setFirstname("John");
    return {
      user: userStore.fullName,
    };
  },
});
</script>
