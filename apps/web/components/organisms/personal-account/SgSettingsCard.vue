<template>
  <v-card class="settings">
    <v-card-text>
      <div class="settings__mode-choice">
        <v-select
          v-model="mode"
          :items="modeOptions"
          item-title="text"
          item-value="value"
          label="Mode"
          density="comfortable"
          hide-details
        />
      </div>

      <div v-if="hasErrors" class="errors">
        <span v-for="(reason, key) in errors" :key="key" class="errors__text">
          {{ reason }}
        </span>
      </div>

      <div v-if="isMode(CASK_MODE)">
        <MoneyField
          v-model="totalPrice"
          label="Prix du fût"
          class="settings__field"
          hide-details
        />
        <MoneyField
          v-model="caskStickPrice"
          label="Prix du bâton"
          class="settings__field"
          readonly
          hide-details
        />
        <p class="stick-quantity">Nombre total de bâtons : {{ totalAmount }}</p>
      </div>

      <div v-if="isMode(CLOSET_MODE)">
        <MoneyField
          v-model="closetStickPrice"
          label="Prix du bâton"
          class="settings__field"
          :min="1"
          hide-details
        />
        <p class="stick-quantity">Nombre total de bâtons : {{ totalAmount }}</p>
      </div>

      <div v-if="isMode(EXTERNAL_EVENT_MODE)">
        <v-text-field
          v-model="externalEventContext"
          label="Contexte de l'événement"
          class="settings__field"
          hide-details
        />
      </div>

      <div v-if="isMode(DEPOSIT_MODE) || isMode(EXTERNAL_EVENT_MODE)">
        <MoneyField
          v-model="totalAmount"
          label="Montant total"
          class="settings__field"
          readonly
          hide-details
        />
      </div>
      <v-btn
        text="Enregistrer"
        :disabled="hasErrors"
        color="primary"
        class="settings__button"
        @click="saveTransactions"
      />

      <v-divider class="divider" />

      <MoneyField
        v-model="totalPersonalAccountBalance"
        label="Solde de la caisse"
        class="settings__field"
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
          class="settings__field"
          return-object
          hide-details
          @update:model-value="updateTotalPriceByBarrel"
        />
        <p v-if="selectedBarrel" class="barrel-date">
          Date d'ouverture : {{ formatDate(selectedBarrel.openedOn) }}
        </p>
        <v-btn
          text="Gestion des fûts"
          class="settings__button"
          color="tertiary"
          @click="openBarrelsDialog"
        />
      </div>

      <v-divider class="divider" />
      <v-btn
        text="Mail aux CP négatifs"
        class="settings__button"
        color="secondary"
        :href="negativeBalanceMailLink"
      />
    </v-card-text>

    <v-dialog v-model="isBarrelsDialogOpen" width="800">
      <ManageBarrelsDialogCard @close="closeBarrelsDialog" />
    </v-dialog>
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
  EXTERNAL_EVENT_MODE,
  type SgMode,
} from "~/utils/transaction/sg-mode";
import type { ConsumerWithAmount } from "~/utils/transaction/consumer";
import {
  FUT,
  PLACARD,
  DEPOT,
  EVENEMENT,
} from "~/utils/transaction/transaction.constants";
import { formatDate } from "@overbookd/time";

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
const externalEventContext = defineModel<string>("externalEventContext", {
  required: true,
});

const props = defineProps({
  consumers: {
    type: Array as PropType<ConsumerWithAmount[]>,
    default: () => [],
  },
  errors: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const modeOptions = [
  { text: FUT, value: CASK_MODE },
  { text: PLACARD, value: CLOSET_MODE },
  { text: DEPOT, value: DEPOSIT_MODE },
  { text: EVENEMENT, value: EXTERNAL_EVENT_MODE },
];

const totalPersonalAccountBalance = computed<number>(() => {
  return props.consumers.reduce((acc, consumer) => acc + consumer.balance, 0);
});
const totalAmount = computed<number>(() =>
  props.consumers.reduce((acc, consumer) => acc + consumer.amount, 0),
);

const barrels = computed<ConfiguredBarrel[]>(
  () => personalAccountStore.barrels,
);
const updateTotalPriceByBarrel = (barrel: ConfiguredBarrel) => {
  const barrelCopy = { ...barrel };
  totalPrice.value = barrelCopy.price;
};

const isBarrelsDialogOpen = ref<boolean>(false);
const openBarrelsDialog = () => (isBarrelsDialogOpen.value = true);
const closeBarrelsDialog = () => (isBarrelsDialogOpen.value = false);

const emit = defineEmits(["save-transactions"]);
const saveTransactions = () => emit("save-transactions");

const isMode = (value: SgMode) => mode.value === value;
const hasErrors = computed<boolean>(() => props.errors.length > 0);

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
    h2 {
      font-size: 1.3rem;
      font-weight: 500;
    }
  }

  &__field {
    margin-top: 15px;
  }

  &__button {
    width: 100%;
    margin: 8px 0;
  }
}

.errors {
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: 10px 0 10px;

  &__text {
    text-align: center;
    color: red;
    font-weight: 500;
    hyphens: auto;
    text-align: center;
  }
}

.barrel-date,
.stick-quantity {
  font-size: 0.9rem;
  opacity: 0.8;
  margin: 4px 0;
}
</style>
