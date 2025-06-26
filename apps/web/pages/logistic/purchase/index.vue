<template>
  <DesktopPageTitle />
  <PurchaseTableCard />

  <v-btn
    icon="mdi-plus-thick"
    aria-label="Créer une fiche achat"
    title="Créer une fiche achat"
    size="large"
    color="primary"
    class="btn-plus"
    rounded="pill"
    @click="openNewPurchaseDialog"
  />

  <v-dialog v-model="isNewPurchaseDialogOpen" max-width="500px">
    <InitPurchaseDialogCard @close="closeNewPurchaseDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
const isNewPurchaseDialogOpen = ref<boolean>(false);
const openNewPurchaseDialog = () => {
  isNewPurchaseDialogOpen.value = true;
};
const closeNewPurchaseDialog = () => {
  isNewPurchaseDialogOpen.value = false;
};
</script>

<style lang="scss" scoped>
.btn-plus {
  position: fixed;
  right: 20px;
  bottom: 20px;
  @media screen and (max-width: $mobile-max-width) {
    bottom: calc($bottom-nav-height + 20px);
  }
}
</style>
