<template>
  <div class="sg-page">
    <SgSettingsCard
      v-model:mode="mode"
      v-model:total-price="totalPrice"
      v-model:selected-barrel="selectedBarrel"
      v-model:closet-stick-price="closetStickPrice"
      v-model:cask-stick-price="caskStickPrice"
      :consumers="consumers"
      :errors="invalidInputsReasons"
      class="sg-page__settings"
      @save-transactions="saveTransactions"
    />
    <SgConsumerTable
      v-model:consumers="consumers"
      :mode="mode"
      :cask-stick-price="caskStickPrice"
      :closet-stick-price="closetStickPrice"
      :loading="consumerLoading"
      class="sg-page__consumer-table"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  BARREL,
  PROVISIONS,
  DEPOSIT,
  type ConfiguredBarrel,
} from "@overbookd/personal-account";
import { computeUnitPrice } from "~/domain/volunteer-consumption/drink-consumption";
import { isInteger } from "~/utils/rules/input.rules";
import type { ConsumerWithConsumption } from "~/utils/transaction/consumer";
import {
  type SgMode,
  CASK_MODE,
  CLOSET_MODE,
  DEPOSIT_MODE,
} from "~/utils/transaction/sg-mode";

useHead({ title: "SG" });

const userStore = useUserStore();
const personalAccountStore = usePersonalAccountStore();
const transactionStore = useTransactionStore();

await personalAccountStore.fetchBarrels();

const consumerLoading = ref<boolean>(false);
if (userStore.personalAccountConsumers.length === 0) {
  consumerLoading.value = true;
}
await userStore.fetchPersonalAccountConsumers();
consumerLoading.value = false;

const consumers = ref<ConsumerWithConsumption[]>([]);
const resetConsumers = () => {
  consumers.value = userStore.personalAccountConsumers.map((consumer) => ({
    ...consumer,
    newConsumption: 0,
  }));
};

const barrels = computed<ConfiguredBarrel[]>(
  () => personalAccountStore.barrels,
);
const selectedBarrel = ref<ConfiguredBarrel | null>(
  barrels.value.at(0) ?? null,
);
const totalPrice = ref<number>(barrels.value.at(0)?.price ?? 0);
const totalConsumptions = computed<number>(() => {
  return consumers.value.reduce(
    (acc, consumer) => acc + consumer.newConsumption,
    0,
  );
});

const closetStickPrice = ref<number>(60);
const caskStickPrice = computed<number>(() => {
  const existsOnlyOneConsumer =
    consumers.value.filter((c) => c.newConsumption > 0).length === 1;
  return existsOnlyOneConsumer
    ? totalPrice.value
    : computeUnitPrice(totalPrice.value, totalConsumptions.value);
});

const mode = ref<SgMode>(CASK_MODE);
watch(
  () => mode.value,
  () => resetConsumers(),
  { immediate: true },
);
const isMode = (value: SgMode) => mode.value === value;

const transactionType = computed<string>(() => {
  if (isMode(CASK_MODE)) return BARREL;
  if (isMode(CLOSET_MODE)) return PROVISIONS;
  return DEPOSIT;
});

const consumersWithConsumption = computed(() => {
  return consumers.value.filter((consumer) => consumer.newConsumption);
});
const invalidInputsReasons = computed<string[]>(() => {
  if (consumersWithConsumption.value.length === 0) {
    return [
      isMode(DEPOSIT_MODE)
        ? "Pas de nouveau dépôt"
        : "Pas de nouvelle consommation",
    ];
  }
  if (isMode(CASK_MODE) && !selectedBarrel.value) {
    return ["Aucun fût n'est sélectionné"];
  }
  if (isMode(CLOSET_MODE) && closetStickPrice.value <= 0) {
    return ["Le prix du bâton de placard ne peut pas être nul ou négatif"];
  }
  if (totalPrice.value === 0) {
    return ["Le prix total ne peut pas être nul"];
  }

  const shouldHaveIntConsumption = isMode(CASK_MODE) || isMode(CLOSET_MODE);
  const invalidConsumers = consumersWithConsumption.value.filter(
    ({ newConsumption }) =>
      shouldHaveIntConsumption && !isInteger(newConsumption.toString()),
  );
  if (shouldHaveIntConsumption && invalidConsumers.length > 0) {
    return invalidConsumers.map(
      (consumer) => `Champs non valide pour: ${consumer.lastname}`,
    );
  }

  const hasNegativeConsumption = consumersWithConsumption.value.some(
    (consumer) => consumer.newConsumption < 0,
  );
  if (hasNegativeConsumption) {
    return ["Les consommations doivent être positives"];
  }
  return [];
});

const saveTransactions = async () => {
  if (invalidInputsReasons.value.length > 0) {
    sendFailureNotification(invalidInputsReasons.value);
    return;
  }

  switch (transactionType.value) {
    case DEPOSIT: {
      const transactions = consumersWithConsumption.value.map(
        ({ id, newConsumption }) => ({ depositor: id, amount: newConsumption }),
      );
      await transactionStore.createDeposits(transactions);
      break;
    }
    case BARREL: {
      const barrelSlug = selectedBarrel.value?.slug;
      if (!barrelSlug) return;
      const transactions = consumersWithConsumption.value.map(
        ({ id, newConsumption }) => ({
          consumer: id,
          consumption: newConsumption,
        }),
      );
      await transactionStore.createBarrelTransactions(barrelSlug, transactions);
      break;
    }
    case PROVISIONS: {
      const transactions = consumersWithConsumption.value.map(
        ({ id, newConsumption }) => ({
          consumer: id,
          consumption: newConsumption,
        }),
      );
      await transactionStore.createProvisionsTransactions(
        closetStickPrice.value,
        transactions,
      );
      break;
    }
  }

  await userStore.fetchPersonalAccountConsumers();
  resetConsumers();
};
</script>

<style lang="scss" scoped>
.sg-page {
  display: flex;
  width: 100%;
  gap: 1rem;
  &__settings {
    width: 20%;
  }
  &__consumer-table {
    width: 80%;
  }
}
</style>
