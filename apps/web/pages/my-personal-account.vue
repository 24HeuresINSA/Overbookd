<template>
  <div class="personal-account">
    <div class="summary">
      <div class="balance">
        <span class="balance__title">Solde de mon compte perso :</span>
        <h1 class="balance__value">{{ balance }}</h1>
      </div>

      <!--<v-btn rounded x-large class="transfer-btn" color="primary">
        Faire un virement
      </v-btn>-->
    </div>

    <TransactionListing />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TransactionListing from "~/components/organisms/personal-account/TransactionListing.vue";
import { Money } from "~/utils/money/money";

export default defineComponent({
  name: "MyPersonalAccount",
  components: { TransactionListing },
  head: () => ({
    title: "Mon compte perso",
  }),
  computed: {
    balance(): string {
      return Money.displayCents(this.$accessor.user.me.balance);
    },
  },
});
</script>

<style lang="scss" scoped>
$footer-height: 34px;

.personal-account {
  display: flex;
  justify-content: center;
  max-height: calc(100vh - #{$header-height} - #{$footer-height});
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
