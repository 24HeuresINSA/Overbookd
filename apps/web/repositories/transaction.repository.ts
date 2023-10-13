import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { Transaction } from "@overbookd/personal-account";

type Context = { $axios: NuxtAxiosInstance };

export class TransactionRepository {
  private static readonly basePath = "transactions";

  static getTransactions(context: Context) {
    return context.$axios.get(this.basePath);
  }

  static getMyTransactions(context: Context) {
    return context.$axios.get(`${this.basePath}/me`);
  }

  static createTransactions(context: Context, transaction: Transaction[]) {
    return context.$axios.post(`${this.basePath}/sg`, transaction);
  }

  static deleteTransaction(context: Context, transactionID: string) {
    return context.$axios.delete(`${this.basePath}/${transactionID}`);
  }
}

export class FakeTransactionRepository {
  static getMyTransactions(): Promise<Transaction[]> {
    return Promise.resolve([
      {
        amount: 100,
        context: "Fût de blonde",
        type: "BARREL",
        date: new Date("2023-10-02"),
      },
      {
        amount: 150,
        context: "Conso placard",
        type: "PROVISIONS",
        date: new Date("2023-08-26"),
      },
      {
        amount: 1000,
        context: "Dépôt",
        type: "DEPOSIT",
        date: new Date("2023-06-12"),
      },
      {
        amount: 500,
        context: "Burger midi local",
        type: "TRANSFER",
        date: new Date("2023-03-12"),
        from: 1,
      },
      {
        amount: 1500,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1502,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1501,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1500,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1502,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1501,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1500,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1502,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
      {
        amount: 1501,
        context: "Repas orga",
        type: "TRANSFER",
        date: new Date("2023-02-10"),
        to: 1,
      },
    ]);
  }
}
