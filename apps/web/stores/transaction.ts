import type { HttpStringified, CreateTransactionForm } from "@overbookd/http";
import type {
  CreateTransferForm,
  Transaction,
  TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { TransactionRepository } from "~/repositories/transaction.repository";
import { isHttpError } from "~/utils/http/api-fetch";
import { sendNotification } from "~/utils/notification/send-notification";

type State = {
  myTransactions: Transaction[];
};

export const useTransactionStore = defineStore("transaction", {
  state: (): State => ({
    myTransactions: [],
  }),
  actions: {
    async fetchMyTransactions() {
      const res = await TransactionRepository.getMyTransactions();
      if (isHttpError(res)) return;
      this.myTransactions = res.map(castTransactionWithDate);
    },

    async sendTransfer(transferForm: CreateTransferForm) {
      const res = await TransactionRepository.sendTransfer(transferForm);
      if (isHttpError(res)) return;
      sendNotification("Le virement a bien été effectué 💸");

      await this.fetchMyTransactions();
      const userStore = useUserStore();
      await userStore.fetchMyInformation();
    },

    async createTransactions(transactions: CreateTransactionForm[]) {
      const res = await TransactionRepository.createTransactions(transactions);
      if (isHttpError(res)) return;
      sendNotification("Les transactions ont bien été enregistrées 💸");

      const userStore = useUserStore();
      const myId = userStore.me.id;
      const castedTransactions = res.map(
        castTransactionWithPayorAndPayeeWithDate,
      );
      const isOneOfMyTransactions = castedTransactions.some(
        ({ payor, payee }) => payor.id === myId || payee.id === myId,
      );
      if (isOneOfMyTransactions) {
        await this.fetchMyTransactions();
        await userStore.fetchMyInformation();
      }
    },
  },
});

function castTransactionWithDate(
  transaction: HttpStringified<Transaction>,
): Transaction {
  return {
    ...transaction,
    date: new Date(transaction.date),
  };
}

function castTransactionWithPayorAndPayeeWithDate(
  transaction: HttpStringified<TransactionWithSenderAndReceiver>,
): TransactionWithSenderAndReceiver {
  return {
    ...transaction,
    createdAt: new Date(transaction.createdAt),
  };
}
