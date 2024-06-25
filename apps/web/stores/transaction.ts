import type { HttpStringified } from "@overbookd/http";
import type {
  CreateTransferForm,
  Transaction,
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
