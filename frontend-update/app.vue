<template>
  <v-app>
    <v-main>
      <v-text-field label="Nom" />
    </v-main>
</v-app>
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
