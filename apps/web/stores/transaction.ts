import type { HttpStringified } from "@overbookd/http";
import { updateItemToList } from "@overbookd/list";
import type {
  CreateBarrelTransaction,
  CreateDepositForm,
  CreateProvisionsTransaction,
  CreateTransferForm,
  MyTransaction,
  TransactionWithSenderAndReceiver,
} from "@overbookd/personal-account";
import { TransactionRepository } from "~/repositories/transaction.repository";
import { isHttpError } from "~/utils/http/api-fetch";

type State = {
  myTransactions: MyTransaction[];
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
      this.myTransactions = res.map(castMyTransactionWithDate);
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

      await this._fetchMyInformation();
    },

    async createDeposits(deposits: CreateDepositForm[]) {
      const res = await TransactionRepository.createDeposits(deposits);
      if (isHttpError(res)) return;
      sendSuccessNotification("Les dépôts ont été enregistrés 💸");

      const isMine = deposits.some(
        ({ depositor }) => depositor === this._getLoggedUserId(),
      );
      if (isMine) await this._fetchMyInformation();
    },

    async createBarrelTransactions(
      barrelSlug: string,
      transactions: CreateBarrelTransaction[],
    ) {
      const form = { barrelSlug, transactions };
      const res = await TransactionRepository.createBarrelTransactions(form);
      if (isHttpError(res)) return;
      sendSuccessNotification("Les transactions fût ont été enregistrées 💸");

      const isMine = transactions.some(
        ({ consumer }) => consumer === this._getLoggedUserId(),
      );
      if (isMine) await this._fetchMyInformation();
    },

    async createProvisionsTransactions(
      stickPrice: number,
      transactions: CreateProvisionsTransaction[],
    ) {
      const form = { stickPrice, transactions };
      const res =
        await TransactionRepository.createProvisionsTransactions(form);
      if (isHttpError(res)) return;
      sendSuccessNotification(
        "Les transactions placard ont été enregistrées 💸",
      );

      const isMine = transactions.some(
        ({ consumer }) => consumer === this._getLoggedUserId(),
      );
      if (isMine) await this._fetchMyInformation();
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

      const myId = this._getLoggedUserId();
      const isMine =
        transaction.payee?.id === myId || transaction.payor?.id === myId;
      if (isMine) await this._fetchMyInformation();
    },

    _getLoggedUserId(): number {
      const userStore = useUserStore();
      return userStore.loggedUser?.id ?? 0;
    },

    async _fetchMyInformation() {
      await this.fetchMyTransactions();
      const userStore = useUserStore();
      userStore.fetchMyInformation();
    },
  },
});

function castMyTransactionWithDate(
  transaction: HttpStringified<MyTransaction>,
): MyTransaction {
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
    date: new Date(transaction.date),
  };
}
