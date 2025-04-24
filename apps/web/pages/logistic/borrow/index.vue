<template>
  <DesktopPageTitle />
  <BorrowTableCard />

  <v-btn
    icon="mdi-plus-thick"
    size="large"
    color="primary"
    class="btn-plus"
    rounded="pill"
    @click="openNewBorrowDialog"
  />

  <v-dialog v-model="isNewBorrowDialogOpen" max-width="500px">
    <InitBorrowDialogCard @close="closeNewBorrowDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
const isNewBorrowDialogOpen = ref<boolean>(false);
const openNewBorrowDialog = () => {
  isNewBorrowDialogOpen.value = true;
};
const closeNewBorrowDialog = () => {
  isNewBorrowDialogOpen.value = false;
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
