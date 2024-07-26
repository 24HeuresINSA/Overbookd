<template>
  <div>
    <h1>Inventaire Matos</h1>
    <InventoryImport v-if="importing" @import-done="switchToDisplay" />
    <InventoryListing v-else @ask-init="switchToImport" />
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "Inventaire Matos" });

const importing = ref<boolean>(false);
const switchToImport = () => (importing.value = true);
const switchToDisplay = () => (importing.value = false);
</script>
