<template>
  <div class="personal-account-page">
    <DesktopPageTitle />

    <div class="personal-account">
      <aside class="personal-account__sidebar">
        <BalanceCard @transfer="openTransferDialog" />
        <BalanceStatsCard class="personal-account__stats" />
      </aside>
      <MyTransactionListing class="personal-account__transactions" />
    </div>
  </div>

  <BottomActionBar class="mobile-only">
    <v-btn
      text="Faire un virement"
      class="flex-1-1-0"
      prepend-icon="mdi-send"
      color="primary"
      variant="flat"
      size="large"
      @click="openTransferDialog"
    />
  </BottomActionBar>

  <v-dialog v-model="isTransferDialogOpen" max-width="600px">
    <CreateTransferDialogCard
      v-if="isTransferDialogOpen"
      @close="closeTransferDialog"
    />
  </v-dialog>
</template>

<script lang="ts" setup>
useHead({ title: "Mon compte perso" });

const transactionStore = useTransactionStore();
transactionStore.fetchMyTransactions();

const isTransferDialogOpen = ref<boolean>(false);
const openTransferDialog = () => (isTransferDialogOpen.value = true);
const closeTransferDialog = () => (isTransferDialogOpen.value = false);
</script>

<style lang="scss" scoped>
$desktop-min-width: calc($mobile-max-width + 0.1px);

.personal-account-page {
  @media screen and (min-width: $desktop-min-width) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
}

.personal-account {
  display: grid;
  grid-template-columns: minmax(340px, 480px) 1fr;
  align-items: start;
  gap: $card-gap;
  padding: $card-margin;

  @media screen and (min-width: $desktop-min-width) {
    flex: 1;
    min-height: 0;
    grid-template-rows: minmax(0, 1fr);
  }

  @media screen and (max-width: $mobile-max-width) {
    grid-template-columns: 1fr;
  }

  &__sidebar {
    display: flex;
    flex-direction: column;
    gap: $card-gap;

    @media screen and (min-width: $desktop-min-width) {
      max-height: 100%;
      overflow-y: auto;
    }

    > * {
      flex-shrink: 0;
    }

    @media screen and (max-width: $mobile-max-width) {
      display: contents;
    }
  }

  &__stats {
    @media screen and (max-width: $mobile-max-width) {
      order: 1;
    }
  }

  &__transactions {
    @media screen and (min-width: $desktop-min-width) {
      max-height: 100%;
    }
  }
}
</style>
