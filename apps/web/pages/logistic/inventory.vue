<template>
  <div>
    <h1>Inventaire Matos</h1>
    <InventoryImport v-if="importing" @import-done="switchToDisplay" />
    <InventoryListing v-else @ask-init="switchToImport" />
    <SnackNotificationContainer></SnackNotificationContainer>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import SnackNotificationContainer from "~/components/molecules/snack/SnackNotificationContainer.vue";
import InventoryImport from "~/components/organisms/logistic/InventoryImport.vue";
import InventoryListing from "~/components/organisms/logistic/InventoryListing.vue";

type InventoryData = {
  importing: boolean;
};

export default Vue.extend({
  name: "Inventory",
  components: { InventoryImport, SnackNotificationContainer, InventoryListing },
  data: (): InventoryData => ({
    importing: false,
  }),
  head: () => ({
    title: "Inventaire Matos",
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
