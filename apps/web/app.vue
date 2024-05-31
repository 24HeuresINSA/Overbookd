<template>
  <NuxtLayout>
    <Header v-show="shouldDisplayHeader" />
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import Header from "~/layouts/header.vue";

const shouldDisplayHeader = computed(() => {
  const route = useRoute();
  return route.path !== "/login";
});
</script>
