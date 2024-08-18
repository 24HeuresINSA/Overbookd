<template>
  <DesktopPageTitle />
  <InventoryImport v-if="importing" @import-done="switchToDisplay" />
  <InventoryListingCard v-else @ask-init="switchToImport" />
</template>

<script lang="ts" setup>
useHead({ title: "Inventaire Matos" });

const importing = ref<boolean>(false);
const switchToImport = () => (importing.value = true);
const switchToDisplay = () => (importing.value = false);
</script>
