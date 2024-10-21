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
</template>

<script lang="ts" setup>
useHead({ title: "Mon compte perso" });

const transactionStore = useTransactionStore();
transactionStore.fetchMyTransactions();
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

  @media screen and (min-width: $mobile-max-width) {
    &__left {
      width: calc(40% - $card-width-minus-gap);
    }

    &__right {
      width: calc(60% - $card-width-minus-gap);
    }
  }
}
</style>
