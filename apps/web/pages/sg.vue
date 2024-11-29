<template>
  <DesktopPageTitle />
  <div class="sg-page">
    <SgSettingsCard
      v-model:mode="mode"
      v-model:total-price="totalPrice"
      v-model:selected-barrel="selectedBarrel"
      v-model:closet-stick-price="closetStickPrice"
      v-model:cask-stick-price="caskStickPrice"
      v-model:external-event-context="externalEventContext"
      :consumers="consumers"
      :errors="invalidInputsReasons"
      class="sg-page__settings"
      @save-transactions="saveTransactions"
    />
    <SgConsumerTableCard
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
  EXTERNAL_EVENT,
  type ConfiguredBarrel,
} from "@overbookd/personal-account";
import { computeUnitPrice } from "~/domain/volunteer-consumption/drink-consumption";
import { isInteger } from "~/utils/rules/input.rules";
import type { ConsumerWithAmount } from "~/utils/transaction/consumer";
import {
  type SgMode,
  CASK_MODE,
  CLOSET_MODE,
  DEPOSIT_MODE,
  EXTERNAL_EVENT_MODE,
} from "~/utils/transaction/sg-mode";

useHead({ title: "SG" });

const userStore = useUserStore();
const personalAccountStore = usePersonalAccountStore();
const transactionStore = useTransactionStore();

const barrels = computed<ConfiguredBarrel[]>(
  () => personalAccountStore.barrels,
);
const selectedBarrel = ref<ConfiguredBarrel | null>(null);
const externalEventContext = ref<string>("");

const consumerLoading = ref<boolean>(
  userStore.personalAccountConsumers.length === 0,
);

onMounted(async () => {
  await personalAccountStore.fetchBarrels();
  selectedBarrel.value = barrels.value.at(0) ?? null;

  userStore.fetchPersonalAccountConsumers().then(() => {
    consumerLoading.value = false;
    resetConsumers();
  });
});

const consumers = ref<ConsumerWithAmount[]>([]);
const resetConsumers = () => {
  consumers.value = userStore.personalAccountConsumers.map((consumer) => ({
    ...consumer,
    amount: 0,
  }));
};

const totalPrice = ref<number>(barrels.value.at(0)?.price ?? 0);
const totalAmount = computed<number>(() =>
  consumers.value.reduce((acc, consumer) => acc + consumer.amount, 0),
);

const closetStickPrice = ref<number>(60);
const caskStickPrice = computed<number>(() =>
  computeUnitPrice(totalPrice.value, totalAmount.value),
);

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
  if (isMode(EXTERNAL_EVENT_MODE)) return EXTERNAL_EVENT;
  return DEPOSIT;
});

const consumersWithAmount = computed(() => {
  return consumers.value.filter((consumer) => consumer.amount);
});
const invalidInputsReasons = computed<string[]>(() => {
  if (consumersWithAmount.value.length === 0) {
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
  if (isMode(EXTERNAL_EVENT_MODE) && !externalEventContext.value.trim()) {
    return ["Aucun contexte n'est renseigné"];
  }

  const shouldHaveIntAmount = isMode(CASK_MODE) || isMode(CLOSET_MODE);
  const invalidConsumers = consumersWithAmount.value.filter(
    ({ amount }) => shouldHaveIntAmount && !isInteger(amount.toString()),
  );
  if (shouldHaveIntAmount && invalidConsumers.length > 0) {
    return invalidConsumers.map(
      (consumer) => `Champs non valide pour: ${consumer.lastname}`,
    );
  }

  const hasNegativeAmount = consumersWithAmount.value.some(
    (consumer) => consumer.amount < 0,
  );
  if (hasNegativeAmount) {
    return ["Les consommations doivent être positives"];
  }
  return [];
});

const createDeposits = (): Promise<void> => {
  const transactions = consumersWithAmount.value.map(({ id, amount }) => ({
    depositor: id,
    amount,
  }));
  return transactionStore.createDeposits(transactions);
};

const createBarrelTransactions = async (): Promise<void> => {
  const barrelSlug = selectedBarrel.value?.slug;
  if (!barrelSlug) return;
  const transactions = consumersWithAmount.value.map(({ id, amount }) => ({
    consumer: id,
    consumption: amount,
  }));
  return transactionStore.createBarrelTransactions(barrelSlug, transactions);
};

const createProvisionsTransactions = (): Promise<void> => {
  const transactions = consumersWithAmount.value.map(({ id, amount }) => ({
    consumer: id,
    consumption: amount,
  }));
  return transactionStore.createProvisionsTransactions(
    closetStickPrice.value,
    transactions,
  );
};

const createExternalEventTransactions = async (): Promise<void> => {
  if (!externalEventContext.value.trim()) return;
  const transactions = consumersWithAmount.value.map(({ id, amount }) => ({
    consumer: id,
    amount: amount,
    context: externalEventContext.value,
  }));
  externalEventContext.value = "";
  return transactionStore.createExternalEventTransactions(transactions);
};

const saveTransactions = async () => {
  if (invalidInputsReasons.value.length > 0) {
    sendFailureNotification(invalidInputsReasons.value);
    return;
  }

  const transactionHandlers: Record<string, () => Promise<void>> = {
    [DEPOSIT]: createDeposits,
    [BARREL]: createBarrelTransactions,
    [PROVISIONS]: createProvisionsTransactions,
    [EXTERNAL_EVENT]: createExternalEventTransactions,
  };
  await transactionHandlers[transactionType.value]();

  await userStore.fetchPersonalAccountConsumers();
  resetConsumers();
};
</script>

<style lang="scss" scoped>
.sg-page {
  display: flex;
  width: 100%;
  gap: $card-gap;
  &__settings {
    width: 30%;
  }
  &__consumer-table {
    width: 70%;
  }
  @media only screen and (max-width: $mobile-max-width) {
    flex-direction: column;
    &__settings,
    &__consumer-table {
      width: 100%;
    }
  }
}
</style>
