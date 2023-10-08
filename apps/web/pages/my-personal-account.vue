<template>
  <div class="personal-account">
    <div class="summary">
      <div class="balance">
        <span class="balance__title">Solde de mon compte perso :</span>
        <h1 class="balance__value">34€</h1>
      </div>

      <v-btn rounded x-large class="transfer-btn" color="primary">
        Faire un virement
      </v-btn>
    </div>

    <TransactionListing />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TransactionListing from "~/components/organisms/personal-account/TransactionListing.vue";

export default defineComponent({
  name: 'MyPersonalAccount',
  components: { TransactionListing },
  head: () => ({
    title: "Mon compte perso",
  }),
});
</script>

<style lang="scss" scoped>
.personal-account {
  display: flex;
  justify-content: center;
  max-height: calc(100vh - #{$header-height} - 34px);
  @media screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    margin: 0 5px;
    padding-top: 5px;
    max-height: unset;
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
  gap: 25%;
  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
  }
}

.balance {
  width: 50%;
  display: flex;
  flex-direction: column;
  text-align: center;
  background-color: $info-primary;
  color: white;
  border-radius: 15px;
  padding-top: 50px;
  padding-bottom: 40px;

  &__title {
    font-size: 1rem;
  }

  &__value {
    font-size: 5rem;
  }

  @media screen and (max-width: $mobile-max-width) {
    width: 100%;
    border-radius: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    padding-top: 15px;
    padding-bottom: 0;
  }
}

.transfer-btn {
  width: 50%;
  @media screen and (max-width: $mobile-max-width) {
    width: unset;
    position: fixed;
    bottom: calc(#{$mobile-header-height} + 20px);
    left: 10px;
    right: 10px;
  }
}
</style>
