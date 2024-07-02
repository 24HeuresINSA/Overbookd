<template>
  <v-card class="settings">
    <div class="settings__mode-choice">
      <h2>Mode</h2>
      <v-btn-toggle v-model="mode" tile color="primary">
        <v-btn :value="CASK_MODE" size="small"> Fût</v-btn>
        <v-btn :value="CLOSET_MODE" size="small"> Placard </v-btn>
        <v-btn :value="DEPOSIT_MODE" size="small"> Dépôt </v-btn>
      </v-btn-toggle>
    </div>

    <v-list v-if="hasErrors">
      <v-list-item v-for="(reason, key) in errors" :key="key">
        <v-list-item-title class="settings__input-error">
          {{ reason }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <div v-if="isMode(CASK_MODE)">
      <MoneyField v-model="totalPrice" label="Prix du fût" />
      <p>Nombre total de bâtons : {{ totalConsumptions }}</p>
      <MoneyField
        v-model="caskStickPrice"
        label="Prix du bâton"
        class="settings__field-without-details"
        readonly
        hide-details
      />
    </div>

    <div v-if="isMode(CLOSET_MODE)">
      <MoneyField v-model="closetStickPrice" label="Prix du bâton" :min="1" />
      <p>Nombre total de bâtons : {{ totalConsumptions }}</p>
    </div>

    <div v-if="isMode(DEPOSIT_MODE)">
      <MoneyField
        v-model="totalConsumptions"
        label="Dépôt total"
        class="settings__field-without-details"
        readonly
        hide-details
      />
    </div>
    <v-btn :disabled="hasErrors" color="primary" @click="saveTransactions">
      Enregistrer
    </v-btn>

    <v-divider class="divider" />

    <MoneyField
      v-model="totalPersonalAccountBalance"
      label="Solde de la caisse"
      class="settings__field-without-details"
      readonly
      hide-details
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
      <v-dialog v-model="isBarrelsDialogOpen" width="600">
        <BarrelsForm @close="closeBarrelsDialog" />
      </v-dialog>
    </div>

    <v-btn class="bottom-button" :href="negativeBalanceMailLink">
      Envoyer un mail aux CP négatifs
    </v-btn>
  </v-card>
</template>

<script lang="ts" setup>
import type { ConfiguredBarrel } from "@overbookd/personal-account";
import { NEGATIVE_CP_BODY_TEMPLATE } from "~/utils/mail/mail-body.constant";
import { mailLinkForClient } from "~/utils/mail/mail.utils";
import {
  CASK_MODE,
  CLOSET_MODE,
  DEPOSIT_MODE,
  type SgMode,
} from "~/utils/transaction/sg-mode";
import type { ConsumerWithConsumption } from "~/utils/transaction/consumer";

const personalAccountStore = usePersonalAccountStore();

const mode = defineModel<SgMode>("mode", { required: true });
const totalPrice = defineModel<number>("totalPrice", { required: true });
const caskStickPrice = defineModel<number>("caskStickPrice", {
  required: true,
});
const closetStickPrice = defineModel<number>("closetStickPrice", {
  required: true,
});
const selectedBarrel = defineModel<ConfiguredBarrel | null>("selectedBarrel", {
  required: true,
});

const props = defineProps({
  consumers: {
    type: Array as PropType<ConsumerWithConsumption[]>,
    default: () => [],
  },
  errors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const totalPersonalAccountBalance = computed<number>(() => {
  return props.consumers.reduce((acc, consumer) => acc + consumer.balance, 0);
});
const totalConsumptions = computed<number>(() => {
  return props.consumers.reduce(
    (acc, consumer) => acc + consumer.newConsumption,
    0,
  );
});

const barrels = computed(() => personalAccountStore.barrels);
const updateTotalPriceByBarrel = (barrel: ConfiguredBarrel) => {
  const barrelCopy = { ...barrel };
  totalPrice.value = barrelCopy.price;
};

const isBarrelsDialogOpen = ref(false);
const openBarrelsDialog = () => (isBarrelsDialogOpen.value = true);
const closeBarrelsDialog = () => (isBarrelsDialogOpen.value = false);

const emit = defineEmits(["save-transactions"]);
const saveTransactions = () => {
  emit("save-transactions");
};

const isMode = (value: SgMode) => mode.value === value;
const hasErrors = computed<boolean>(() => {
  return props.errors.length > 0;
});

const negativeBalanceMailLink = computed<string>(() => {
  const inDebtConsumers = props.consumers.filter((c) => c.balance < 0);
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
.settings {
  display: flex;
  flex-direction: column;
  padding: 0 5px;
  height: fit-content;

  &__mode-choice {
    display: flex;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;
  }

  &__input-error {
    text-align: center;
    color: red;
    hyphens: auto;
  }

  &__field-without-details {
    margin-bottom: 15px;
  }
}

.divider {
  margin: 16px 0;
}

.bottom-button {
  width: 100%;
  margin-bottom: 10px;
}
</style>
