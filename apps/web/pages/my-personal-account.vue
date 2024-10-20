<template>
  <DesktopPageTitle />
  <div class="personal-account">
    <div class="personal-account__left">
      <BalanceGraphCards />
    </div>
    <div class="personal-account__right">
      <MyTransactionListing />
    </div>
  </div>

  <v-dialog v-model="isTransferDialogOpen" max-width="600px">
    <CreateTransferDialogCard @close="isTransferDialogOpen = false" />
  </v-dialog>
</template>

<script lang="ts" setup>
useHead({ title: "Mon compte perso" });

const transactionStore = useTransactionStore();
transactionStore.fetchMyTransactions();

const isTransferDialogOpen = ref<boolean>(false);
</script>

<style lang="scss" scoped>
$card-width-minus-gap: calc($card-gap / 2);

.personal-account {
  display: flex;
  justify-content: space-between;
  gap: $card-gap;
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
  }

  &__left {
    width: calc(40% - $card-width-minus-gap);
  }
  &__right {
    width: calc(60% - $card-width-minus-gap);
  }
}
</style>
