<template>
  <v-card>
    <v-card-title class="home-card__title">
      <v-icon icon="mdi-wallet" />
      <span>Solde du CP</span>
    </v-card-title>
    <v-card-text class="balance-card__content">
      <p
        class="balance"
        :class="{ 'text-error': balance < 0, 'text-success': balance > 0 }"
      >
        {{ displayableBalance }}
      </p>

      <v-btn
        text="Faire un virement"
        prepend-icon="mdi-send"
        color="primary"
        variant="flat"
        size="large"
        class="desktop-only"
        block
        @click="emit('transfer')"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { Money } from "@overbookd/money";

const emit = defineEmits(["transfer"]);

const myStore = useMyStore();

const balance = computed<number>(() => myStore.loggedUser?.balance ?? 0);
const displayableBalance = computed<string>(() =>
  Money.cents(balance.value).toString(),
);
</script>

<style lang="scss" scoped>
@use "~/components/organisms/home-dashboard/home-dashboard.scss" as *;

.balance {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
}

.balance-card__content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
}
</style>
