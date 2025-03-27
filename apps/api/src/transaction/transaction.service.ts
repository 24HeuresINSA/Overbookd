import { Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { JwtPayload } from "../authentication/entities/jwt-util.entity";
import {
  PastSharedMeal,
  SharedMealPayment,
  SharedMealTransaction,
  MyTransaction,
  TransactionWithSenderAndReceiver,
  CreateDepositForm,
  Deposit,
  CreateBarrelTransaction,
  CreateBarrelTransactions,
  ConfiguredBarrel,
  CreateProvisionsTransactions,
  CreateProvisionsTransaction,
} from "@overbookd/personal-account";
import { PrismaTransactions } from "./repository/transactions.prisma";
import { DomainEventService } from "../domain-event/domain-event.service";
import { NewExternalEventConsumption } from "@overbookd/personal-account";
import { CreateExternalEventTransactions } from "@overbookd/personal-account";

export type Barrels = {
  findBySlug: (slug: string) => Promise<ConfiguredBarrel>;
};

type Repositories = {
  transactions: Readonly<PrismaTransactions>;
  barrels: Readonly<Barrels>;
};

type UseCases = {
  deposit: Readonly<Deposit>;
  barrel: Readonly<CreateBarrelTransactions>;
  provisions: Readonly<CreateProvisionsTransactions>;
  externalEvent: Readonly<CreateExternalEventTransactions>;
};

export type Transactions = {
  getAll: () => Promise<TransactionWithSenderAndReceiver[]>;
  getMine: (userId: number) => Promise<MyTransaction[]>;
  checkIfDeletable: (id: number) => Promise<void>;
  deleteOne: (id: number) => Promise<void>;
  createManyForSharedMeal: (
    transactions: SharedMealTransaction[],
  ) => Promise<void>;
};

@Injectable()
export class TransactionService implements OnApplicationBootstrap {
  private logger = new Logger(TransactionService.name);

  constructor(
    private readonly repositories: Repositories,
    private readonly useCases: UseCases,
    private readonly eventStore: DomainEventService,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.closedSharedMeal.subscribe(({ data: event }) => {
      const mealTransactionsMessage = `Shared meal #${event.id} closed... Generating related transactions`;
      this.logger.log(mealTransactionsMessage);
      this.generateForMeal(event);
    });
  }

  async getAllTransactions(): Promise<TransactionWithSenderAndReceiver[]> {
    return this.repositories.transactions.getAll();
  }

  async getMyTransactions(user: JwtPayload): Promise<MyTransaction[]> {
    return this.repositories.transactions.getMine(user.id);
  }

  async addDeposits(deposits: CreateDepositForm[]): Promise<void> {
    await this.useCases.deposit.applyMultiple(deposits);
  }

  async addBarrelTransactions(
    barrelSlug: string,
    transactions: CreateBarrelTransaction[],
  ): Promise<void> {
    const barrel = await this.repositories.barrels.findBySlug(barrelSlug);
    await this.useCases.barrel.apply(barrel, transactions);
  }

  async addProvisionsTransactions(
    stickPrice: number,
    transactions: CreateProvisionsTransaction[],
  ): Promise<void> {
    await this.useCases.provisions.apply(stickPrice, transactions);
  }

  async addExternalEventTransactions(
    consumptions: NewExternalEventConsumption[],
  ): Promise<void> {
    await this.useCases.externalEvent.applyMultiple(consumptions);
  }

  async deleteTransaction(id: number): Promise<void> {
    await this.repositories.transactions.checkIfDeletable(id);
    await this.repositories.transactions.deleteOne(id);
  }

  private async generateForMeal(event: PastSharedMeal) {
    const transactions = SharedMealPayment.refound(event);
    const mealTransactionsMessage = `Generating ${transactions.length} transactions for meal #${event.id}`;
    this.logger.log(mealTransactionsMessage);
    await this.repositories.transactions.createManyForSharedMeal(transactions);
  }
}
