<template>
  <div>
    <h1>Inventaire</h1>
    <InventoryImport v-if="importing" @import-done="switchToDisplay" />
    <InventoryListing v-else @ask-init="switchToImport" />
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import InventoryImport from "~/components/organisms/InventoryImport.vue";
import InventoryListing from "~/components/organisms/InventoryListing.vue";

interface InventoryData {
  importing: boolean;
}

export default Vue.extend({
  name: "Inventory",
  components: { InventoryImport, SnackNotificationContainer, InventoryListing },
  data: (): InventoryData => ({
    importing: false,
  }),
  methods: {
    switchToImport() {
      this.importing = true;
    },
    switchToDisplay() {
      this.importing = false;
    },
  },
});
</script>
