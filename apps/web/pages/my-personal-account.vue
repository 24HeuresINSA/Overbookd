<template>
  <div class="personal-account">
    <div class="summary">
      <div class="balance">
        <span class="balance__title">Solde de mon compte perso :</span>
        <h1 class="balance__value">{{ balance }}</h1>
      </div>

      <v-btn
        rounded
        size="x-large"
        class="transfer-btn"
        color="primary"
        @click="isTransferDialogOpen = true"
      >
        Faire un virement
      </v-btn>
    </div>

    <MyTransactionListing />

    <v-dialog v-model="isTransferDialogOpen" max-width="600px">
      <CreateTransferForm @close="isTransferDialogOpen = false" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";

useHead({ title: "Mon compte perso" });

const userStore = useUserStore();

const isTransferDialogOpen = ref(false);

const balance = computed(() => Money.cents(userStore.me.balance).toString());
</script>

<style lang="scss" scoped>
$footer-height: 34px;

.personal-account {
  display: flex;
  justify-content: center;
  height: calc(100vh - #{$header-height} - #{$footer-height} - 20px);
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    margin: 0 5px;
    height: unset;
  }
}

.summary {
  display: flex;
  flex-direction: column;
  position: sticky;
  width: 50%;
  top: $mobile-header-height;
  z-index: 5;
  justify-content: center;
  align-items: center;
  gap: calc(25% + 20px);
  .balance,
  .transfer-btn {
    width: min(90%, 650px);
  }
  .balance {
    display: flex;
    flex-direction: column;
    text-align: center;
    background-color: $info-primary;
    color: white;
    border-radius: 15px;
    padding: 50px 10% 40px 10%;

    &__title {
      font-size: 1rem;
    }

    &__value {
      font-size: 5rem;
    }
  }

  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
    .balance {
      width: 100%;
      border-radius: 0;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      padding: 0;
      padding-top: 15px;
    }
    .transfer-btn {
      width: unset;
      position: fixed;
      bottom: calc(#{$mobile-header-height} + 20px);
      left: 10px;
      right: 10px;
    }
  }
}
</style>
