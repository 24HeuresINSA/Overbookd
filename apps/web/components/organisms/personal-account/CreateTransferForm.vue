<template>
  <v-card class="transfer">
    <v-btn class="close-btn" icon="mdi-close" variant="flat" @click="close" />
    <v-card-title class="transfer__title">
      <h2>Faire un virement</h2>
    </v-card-title>
    <v-card-text>
      <form>
        <div class="fields">
          <MoneyField v-model="amount" label="Montant du virement" :min="1" />
          <SearchUser v-model="payee" label="Bénéficiaire" :list="adherents" />
          <v-text-field v-model="context" label="Motif" />
        </div>
        <v-btn
          prepend-icon="mdi-send"
          text="Envoyer le virement"
          color="success"
          size="large"
          :disabled="!isTransferValid"
          @click="sendTransfer"
        />
      </form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Consumer } from "@overbookd/http";
import { ONE_EURO_IN_CENTS } from "@overbookd/personal-account";

const userStore = useUserStore();
const transactionStore = useTransactionStore();
userStore.fetchPersonalAccountConsumers();

const amount = ref(ONE_EURO_IN_CENTS);
const payee = ref<Consumer | null>(null);
const context = ref("");

const isTransferValid = computed(
  () => amount.value > 0 && payee.value !== null && context.value !== "",
);
const adherents = computed<Consumer[]>(() =>
  userStore.personalAccountConsumers.filter(
    (consumer) => consumer.id !== userStore.me.id,
  ),
);

const sendTransfer = async () => {
  if (!isTransferValid) return;

  await transactionStore.sendTransfer({
    amount: amount.value,
    to: payee.value?.id as number,
    context: context.value,
  });

  close();
};

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.transfer {
  &__title {
    display: flex;
    justify-content: center;
    h2 {
      flex: 1;
      text-align: center;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
    .fields {
      width: 80%;
    }
  }

  .close-btn {
    position: absolute;
    top: 3px;
    right: 3px;
  }
}
</style>
