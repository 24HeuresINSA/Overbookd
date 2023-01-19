<template>
  <div>
    <h1>Inventaire</h1>
    <InventoryImport />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import InventoryImport from "~/components/organisms/InventoryImport.vue";

export default Vue.extend({
  name: "Inventory",
  components: { InventoryImport },
});
</script>
