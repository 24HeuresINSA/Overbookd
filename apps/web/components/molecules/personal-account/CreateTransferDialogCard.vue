<template>
  <v-card class="transfer">
    <v-card-item>
      <v-card-title class="transfer__title">
        <v-icon icon="mdi-send" />
        Faire un virement
      </v-card-title>
      <template #append>
        <v-btn
          icon="mdi-close"
          aria-label="Fermer"
          title="Fermer"
          variant="text"
          @click="close"
        />
      </template>
    </v-card-item>

    <v-card-text class="transfer__content">
      <section class="who">
        <SearchUser
          v-model="payee"
          :list="adherents"
          label="Bénéficiaire"
          prepend-inner-icon="mdi-account-search"
          hide-details
          with-avatar
        />

        <div v-if="recentPayees.length > 0" class="payees">
          <button
            v-for="recentPayee in recentPayees"
            :key="recentPayee.id"
            type="button"
            class="payee"
            :class="{ 'payee--selected': payee?.id === recentPayee.id }"
            :title="buildUserNameWithNickname(recentPayee)"
            :aria-pressed="payee?.id === recentPayee.id"
            @click="payee = recentPayee"
          >
            <UserAvatar
              :picture="recentPayee.profilePicture ?? undefined"
              :size="40"
            />
            <span class="payee__name">
              {{ nicknameOrFirstName(recentPayee) }}
            </span>
          </button>
        </div>
      </section>

      <section class="what">
        <MoneyField v-model="amount" label="Montant" :min="1" hide-details />
        <v-text-field
          v-model="context"
          label="Motif"
          placeholder="Remboursement pizza, covoit..."
          hide-details
        />
      </section>

      <p class="balance-after">
        Solde après virement :
        <strong :class="{ 'text-error': balanceAfter < 0 }">
          {{ Money.cents(balanceAfter).toString() }}
        </strong>
      </p>

      <v-btn
        color="primary"
        variant="flat"
        size="large"
        :text="sendLabel"
        append-icon="mdi-send"
        :disabled="!isTransferValid"
        :loading="isSending"
        block
        @click="sendTransfer"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import type { Consumer } from "@overbookd/http";
import { Money } from "@overbookd/money";
import {
  type MyTransaction,
  type TransferISendTransaction,
  ONE_EURO_IN_CENTS,
  TRANSFER,
} from "@overbookd/personal-account";
import {
  type User,
  buildUserNameWithNickname,
  nicknameOrFirstName,
} from "@overbookd/user";
import { byMostRecent } from "~/utils/transaction/transaction.utils";

const MAX_RECENT_PAYEES = 6;

const myStore = useMyStore();
const userStore = useUserStore();
const transactionStore = useTransactionStore();
userStore.fetchPersonalAccountConsumers();

const amount = ref<number>(ONE_EURO_IN_CENTS);
const payee = ref<User | undefined>(undefined);
const context = ref<string>("");
const isSending = ref<boolean>(false);

const isTransferValid = computed<boolean>(
  () =>
    amount.value > 0 &&
    payee.value !== undefined &&
    context.value.trim() !== "",
);
const adherents = computed<Consumer[]>(() =>
  userStore.personalAccountConsumers.filter(
    (consumer) => consumer.id !== myStore.loggedUser?.id,
  ),
);

const balanceAfter = computed<number>(
  () => (myStore.loggedUser?.balance ?? 0) - amount.value,
);
const sendLabel = computed<string>(() => {
  const money = Money.cents(amount.value).toString();
  if (!payee.value) return `Envoyer ${money}`;
  return `Envoyer ${money} à ${nicknameOrFirstName(payee.value)}`;
});

const isTransferISend = (
  transaction: MyTransaction,
): transaction is TransferISendTransaction =>
  transaction.type === TRANSFER && "to" in transaction;

const recentPayees = computed<Consumer[]>(() => {
  const payeeIds = transactionStore.myTransactions
    .toSorted(byMostRecent)
    .filter(isTransferISend)
    .map(({ to }) => to.id);
  const uniquePayeeIds = [...new Set(payeeIds)];

  return uniquePayeeIds
    .map((id) => adherents.value.find((adherent) => adherent.id === id))
    .filter((adherent): adherent is Consumer => adherent !== undefined)
    .slice(0, MAX_RECENT_PAYEES);
});

const sendTransfer = async () => {
  if (!isTransferValid.value || !payee.value) return;

  isSending.value = true;
  const isSent = await transactionStore.sendTransfer({
    amount: amount.value,
    to: payee.value.id,
    context: context.value.trim(),
  });
  isSending.value = false;
  if (isSent) close();
};

const emit = defineEmits(["close"]);
const close = () => emit("close");
</script>

<style lang="scss" scoped>
.transfer {
  &__title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: rgb(var(--v-theme-secondary));
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
}

.who {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.what {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;

  @media screen and (max-width: $mobile-max-width) {
    grid-template-columns: 1fr;
  }
}

.payees {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 8px;

  @media screen and (max-width: $mobile-max-width) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.payee {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
  padding: 6px 4px;
  border: 2px solid transparent;
  border-radius: 12px;
  transition:
    background-color 0.2s,
    border-color 0.2s;

  &:hover,
  &:focus-visible {
    background-color: rgba(var(--v-theme-secondary), 0.15);
  }

  &--selected {
    border-color: rgb(var(--v-theme-primary));
  }

  &__name {
    max-width: 100%;
    font-size: 0.8rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.balance-after {
  text-align: right;
  font-size: 0.9rem;
  color: rgba(var(--v-theme-on-surface), 0.7);
}
</style>
