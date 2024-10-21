<template>
  <DialogCard @close="close">
    <template #title> Faire un virement </template>
    <template #content>
      <div class="transfer-fields">
        <MoneyField v-model="amount" label="Montant du virement" :min="1" />
        <SearchUser v-model="payee" label="Bénéficiaire" :list="adherents" />
        <v-text-field v-model="context" label="Motif" />
      </div>
    </template>
    <template #actions>
      <v-btn
        prepend-icon="mdi-send"
        text="Envoyer le virement"
        size="large"
        :disabled="!isTransferValid"
        @click="sendTransfer"
      />
    </template>
  </DialogCard>
</template>

<script lang="ts" setup>
import type { Consumer } from "@overbookd/http";
import { ONE_EURO_IN_CENTS } from "@overbookd/personal-account";

const userStore = useUserStore();
const transactionStore = useTransactionStore();
userStore.fetchPersonalAccountConsumers();

const amount = ref<number>(ONE_EURO_IN_CENTS);
const payee = ref<Consumer | undefined>(undefined);
const context = ref<string>("");

const isTransferValid = computed<boolean>(
  () => amount.value > 0 && payee.value !== undefined && context.value !== "",
);
const adherents = computed<Consumer[]>(() =>
  userStore.personalAccountConsumers.filter(
    (consumer) => consumer.id !== userStore.loggedUser?.id,
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

  amount.value = ONE_EURO_IN_CENTS;
  payee.value = undefined;
  context.value = "";
};

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style scoped>
.transfer-fields {
  display: flex;
  flex-direction: column;
}
</style>
