<template>
  <DesktopPageTitle />
  <div class="personal-account">
    <div class="summary">
      <div class="balance">
        <span class="balance__title">Solde de mon compte perso :</span>
        <h1 class="balance__value">{{ balance }}</h1>
      </div>

      <v-btn
        text="Faire un virement"
        size="x-large"
        class="transfer-btn"
        color="primary"
        rounded
        @click="isTransferDialogOpen = true"
      />
    </div>

    <MyTransactionListing />

    <v-dialog v-model="isTransferDialogOpen" max-width="600px">
      <CreateTransferDialogCard @close="isTransferDialogOpen = false" />
    </v-dialog>
  </div>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";

useHead({ title: "Mon compte perso" });

const userStore = useUserStore();

const isTransferDialogOpen = ref<boolean>(false);
const balance = computed<string>(() =>
  Money.cents(userStore.loggedUser?.balance ?? 0).toString(),
);
</script>

<style lang="scss" scoped>
.personal-account {
  display: flex;
  justify-content: center;
  height: 100%;
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
    background-color: rgb(var(--v-theme-primary));
    color: rgb(var(--v-theme-on-primary));
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
      padding: 0;
      padding-top: 15px;
    }
    .transfer-btn {
      width: unset;
      position: fixed;
      bottom: calc($bottom-nav-height + 20px);
      left: 10px;
      right: 10px;
    }
  }
}
</style>
