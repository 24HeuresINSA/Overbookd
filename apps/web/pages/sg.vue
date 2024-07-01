<template>
  <div class="sg-page">
    <v-card class="settings">
      <div class="settings__mode-choice">
        <h2>Mode</h2>
        <v-btn-toggle v-model="mode" tile color="primary">
          <v-btn :value="CASK_MODE" size="small"> Fût</v-btn>
          <v-btn :value="CLOSET_MODE" size="small"> Placard </v-btn>
          <v-btn :value="DEPOSIT_MODE" size="small"> Dépôt </v-btn>
        </v-btn-toggle>
      </div>

      <v-list v-if="hasInvalidInputs">
        <v-list-item v-for="(reason, key) in invalidInputsReasons" :key="key">
          <v-list-item-title class="settings__input-error">
            {{ reason }}
          </v-list-item-title>
        </v-list-item>
      </v-list>

      <div v-if="isMode(CASK_MODE)">
        <MoneyField v-model="totalPrice" label="Prix du fût" />
        <p>Nombre total de bâtons : {{ totalConsumptions }}</p>
        <MoneyField v-model="stickPrice" label="Prix du bâton" readonly />
      </div>

      <div v-if="isMode(CLOSET_MODE)">
        <MoneyField v-model="settledStickPrice" label="Prix du bâton" />
        <p>Nombre total de bâtons : {{ totalConsumptions }}</p>
      </div>

      <div v-if="isMode(DEPOSIT_MODE)">
        <MoneyField v-model="totalConsumptions" label="Dépôt total" readonly />
      </div>
      <v-btn :disabled="hasInvalidInputs" @click="saveTransactions">
        Enregistrer
      </v-btn>

      <v-divider class="divider" />

      <MoneyField
        v-model="totalPersonalAccountBalance"
        label="Solde de la caisse"
        readonly
      />

      <div v-if="isMode(CASK_MODE)">
        <v-select
          v-model="selectedBarrel"
          prepend-icon="mdi-beer"
          label="Fût"
          variant="outlined"
          :items="barrels"
          item-title="drink"
          return-object
          @update:model-value="updateTotalPriceByBarrel"
        />
        <v-btn class="bottom-button" @click="openBarrelsDialog">
          Gestion des fûts
        </v-btn>
      </div>

      <v-btn class="bottom-button" :href="negativeBalanceMailLink">
        Envoyer un mail aux CP négatifs
      </v-btn>
    </v-card>
  </div>

  <v-dialog v-model="isBarrelsDialogOpen" width="600">
    <BarrelsForm @close="closeBarrelsDialog" />
  </v-dialog>
</template>

<script lang="ts" setup>
import type { Consumer, CreateTransactionForm } from "@overbookd/http";
import {
  BARREL,
  PROVISIONS,
  DEPOSIT,
  type ConfiguredBarrel,
} from "@overbookd/personal-account";
import { computeUnitPrice } from "~/domain/volunteer-consumption/drink-consumption";
import { NEGATIVE_CP_BODY_TEMPLATE } from "~/utils/mail/mail-body.constant";
import { mailLinkForClient } from "~/utils/mail/mail.utils";
import { sendNotification } from "~/utils/notification/send-notification";

useHead({ title: "SG" });

const CASK_MODE = "cask";
const CLOSET_MODE = "closet";
const DEPOSIT_MODE = "deposit";
type Mode = typeof CASK_MODE | typeof CLOSET_MODE | typeof DEPOSIT_MODE;
const mode = ref<Mode>(CASK_MODE);

const userStore = useUserStore();
const personalAccountStore = usePersonalAccountStore();
const transactionStore = useTransactionStore();

await personalAccountStore.fetchBarrels();
userStore.fetchPersonalAccountConsumers();

type ConsumerWithConsumption = Consumer & {
  newConsumption: number;
};
const consumers = computed<ConsumerWithConsumption[]>(() => {
  return userStore.personalAccountConsumers.map((consumer) => ({
    ...consumer,
    newConsumption: 0,
  }));
});
const consumersWithConsumption = computed<ConsumerWithConsumption[]>(() => {
  return consumers.value.filter((consumer) => consumer.newConsumption);
});

const barrels = computed(() => personalAccountStore.barrels);
const selectedBarrel = ref<ConfiguredBarrel | null>(
  barrels.value.at(0) ?? null,
);
const totalPrice = ref<number>(barrels.value.at(0)?.price ?? 0);
const updateTotalPriceByBarrel = (barrel: ConfiguredBarrel) => {
  const barrelCopy = { ...barrel };
  totalPrice.value = barrelCopy.price;
};

const totalPersonalAccountBalance = computed<number>(() => {
  return consumers.value.reduce((acc, consumer) => acc + consumer.balance, 0);
});
const totalConsumptions = computed<number>(() => {
  return consumers.value.reduce(
    (acc, consumer) => acc + consumer.newConsumption,
    0,
  );
});
const stickPrice = computed<number>(() => {
  return computeUnitPrice(totalPrice.value, totalConsumptions.value);
});
const settledStickPrice = ref<number>(60);

const isBarrelsDialogOpen = ref(false);
const openBarrelsDialog = () => (isBarrelsDialogOpen.value = true);
const closeBarrelsDialog = () => (isBarrelsDialogOpen.value = false);

const isMode = (value: Mode) => mode.value === value;

const transactionType = computed(() => {
  if (isMode(CASK_MODE)) return BARREL;
  if (isMode(CLOSET_MODE)) return PROVISIONS;
  return DEPOSIT;
});

const calculateSpentAmount = (consumption: number) => {
  if (isMode(CASK_MODE)) return stickPrice.value * consumption;
  if (isMode(CLOSET_MODE)) return settledStickPrice.value * consumption;
  return consumption;
};

const stickWord = (consumption: number) => {
  return consumption > 1 ? "bâtons" : "bâton";
};
const defineTransactionContext = (consumption: number) => {
  if (isMode(CASK_MODE)) {
    const barrel = selectedBarrel.value
      ? `Fût de ${selectedBarrel.value.drink}`
      : "Fût";
    return `${barrel}: ${consumption} ${stickWord(consumption)}`;
  }
  if (isMode(CLOSET_MODE)) {
    return `Conso placard: ${consumption} ${stickWord(consumption)}`;
  }
  return "Recharge de compte perso";
};

const saveTransactions = async () => {
  if (isMode(CASK_MODE) && !selectedBarrel.value) {
    return sendNotification("Aucun fût n'est selectionné");
  }
  const hasNegativeConsumption = consumersWithConsumption.value.some(
    (consumer) => consumer.newConsumption < 0,
  );
  if (hasNegativeConsumption) {
    return sendNotification("Les consommations doivent être positives");
  }
  if (totalPrice.value === 0) {
    return sendNotification("Le prix total ne peut pas être nul");
  }

  const transactions = consumersWithConsumption.value.map((consumer) => {
    const type = transactionType.value;
    const amount = calculateSpentAmount(consumer.newConsumption);
    const context = defineTransactionContext(consumer.newConsumption);
    const transaction: CreateTransactionForm = {
      from: consumer.id,
      to: consumer.id,
      type,
      amount,
      context,
    };

    consumer.balance =
      type === DEPOSIT ? consumer.balance + amount : consumer.balance - amount;

    return transaction;
  });

  await transactionStore.createTransactions(transactions);
  await userStore.fetchPersonalAccountConsumers();
};

const invalidInputsReasons = computed<string[]>(() => {
  if (consumersWithConsumption.value.length === 0) {
    return ["Pas de nouvelle consommation ou dépôt"];
  }

  const shouldHaveIntConsumption = isMode(DEPOSIT_MODE) || isMode(CLOSET_MODE);
  const invalidConsumers = consumersWithConsumption.value.filter(
    (consumer) =>
      shouldHaveIntConsumption && !Number.isInteger(consumer.newConsumption),
  );
  if (shouldHaveIntConsumption && invalidConsumers.length > 0) {
    return invalidConsumers.map(
      (consumer) =>
        `Champs non valide pour l'utilisateur:  ${consumer.lastname}`,
    );
  }
  return [];
});
const hasInvalidInputs = computed<boolean>(() => {
  return invalidInputsReasons.value.length > 0;
});

const negativeBalanceMailLink = computed<string>(() => {
  const inDebtConsumers = consumers.value.filter(
    (consumer) => consumer.balance < 0,
  );
  const mails = inDebtConsumers.map((consumer) => consumer.email);

  const mailVars = {
    bcc: mails.join("; "),
    subject: "[24 heures] Ton compte perso est dans le négatif",
    body: NEGATIVE_CP_BODY_TEMPLATE,
  };
  return mailLinkForClient(mailVars);
});
</script>

<style lang="scss" scoped>
.sg-page {
  display: flex;
}

.settings {
  display: flex;
  flex-direction: column;
  padding: 0 5px;

  &__mode-choice {
    display: flex;
    gap: 20px;
    align-items: center;
  }

  &__input-error {
    color: red;
  }
}

.divider {
  margin: 15px 0;
}

.bottom-button {
  width: 100%;
  margin-bottom: 10px;
}
</style>
