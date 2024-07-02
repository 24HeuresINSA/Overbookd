import type { HttpStringified, CreateTransactionForm } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import type {
  CreateTransferForm,
  Transaction,
  TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { TransactionRepository } from "~/repositories/transaction.repository";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  myTransactions: Transaction[];
  allTransactions: TransactionWithSenderAndReceiver[];
};

export const useTransactionStore = defineStore("transaction", {
  state: (): State => ({
    myTransactions: [],
    allTransactions: [],
  }),
  actions: {
    async fetchMyTransactions() {
      const res = await TransactionRepository.getMyTransactions();
      if (isHttpError(res)) return;
      this.myTransactions = res.map(castTransactionWithDate);
    },

    async fetchAllTransactions() {
      const res = await TransactionRepository.getTransactions();
      if (isHttpError(res)) return;
      this.allTransactions = res.map(castTransactionWithPayorAndPayeeWithDate);
    },

    async sendTransfer(transferForm: CreateTransferForm) {
      const res = await TransactionRepository.sendTransfer(transferForm);
      if (isHttpError(res)) return;
      sendSuccessNotification("Le virement a bien été effectué 💸");

      await this.fetchMyTransactions();
      const userStore = useUserStore();
      userStore.fetchMyInformation();
    },

    async createTransactions(transactions: CreateTransactionForm[]) {
      const res = await TransactionRepository.createTransactions(transactions);
      if (isHttpError(res)) return;
      sendSuccessNotification("Les transactions ont bien été enregistrées 💸");

      const castedTransactions = res.map(
        castTransactionWithPayorAndPayeeWithDate,
      );
      this._fetchMyInformationIfNeeded(castedTransactions);
    },

    async deleteTransaction(transaction: TransactionWithSenderAndReceiver) {
      const res = await TransactionRepository.deleteTransaction(transaction.id);
      if (isHttpError(res)) return;
      sendSuccessNotification("La transaction a bien été supprimée 💸");

      const transactionIndex = this.allTransactions.findIndex(
        ({ id }) => id === transaction.id,
      );
      if (transactionIndex === -1) return;
      const updatedTransaction = { ...transaction, isDeleted: true };
      this.allTransactions = updateItemToList(
        this.allTransactions,
        transactionIndex,
        updatedTransaction,
      );

      this._fetchMyInformationIfNeeded([transaction]);
    },

    _fetchMyInformationIfNeeded(
      transactions: TransactionWithSenderAndReceiver[],
    ) {
      const userStore = useUserStore();
      const myId = userStore.me.id;
      const isOneOfMyTransactions = transactions.some(
        ({ payor, payee }) => payor.id === myId || payee.id === myId,
      );
      if (isOneOfMyTransactions) {
        this.fetchMyTransactions();
        userStore.fetchMyInformation();
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
