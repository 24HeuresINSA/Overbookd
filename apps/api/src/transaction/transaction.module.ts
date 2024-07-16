import { Module } from "@nestjs/common";
import {
  CreateBarrelTransactions,
  CreateProvisionsTransactions,
  Deposit,
  Transfer,
} from "@overbookd/personal-account";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { PrismaTransfers } from "./repository/transfers.prisma";
import { PrismaTransferMembers } from "./repository/transfer-members.prisma";
import { TransferService } from "./transfer.service";
import { PrismaTransactions } from "./repository/transactions.prisma";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";
import { PrismaDeposits } from "./repository/deposits.prisma";
import { PrismaBarrels } from "./repository/barrels.prisma";
import { PrismaBarrelTransactions } from "./repository/barrel-transactions.prisma";
import { PrismaProvisionsTransactions } from "./repository/provisions-transactions.prisma";

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: PrismaTransactions,
      useFactory: (prisma: PrismaService) => new PrismaTransactions(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaDeposits,
      useFactory: (prisma: PrismaService) => new PrismaDeposits(prisma),
      inject: [PrismaService],
    },
    {
      provide: Deposit,
      useFactory: (deposits: PrismaDeposits) => new Deposit(deposits),
      inject: [PrismaDeposits],
    },
    {
      provide: PrismaBarrels,
      useFactory: (prisma: PrismaService) => new PrismaBarrels(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaBarrelTransactions,
      useFactory: (prisma: PrismaService) =>
        new PrismaBarrelTransactions(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateBarrelTransactions,
      useFactory: (barrelTransactions: PrismaBarrelTransactions) =>
        new CreateBarrelTransactions(barrelTransactions),
      inject: [PrismaBarrelTransactions],
    },
    {
      provide: PrismaProvisionsTransactions,
      useFactory: (prisma: PrismaService) =>
        new PrismaProvisionsTransactions(prisma),
      inject: [PrismaService],
    },
    {
      provide: CreateProvisionsTransactions,
      useFactory: (provisionsTransactions: PrismaProvisionsTransactions) =>
        new CreateProvisionsTransactions(provisionsTransactions),
      inject: [PrismaProvisionsTransactions],
    },
    {
      provide: TransactionService,
      useFactory: (
        transactions: PrismaTransactions,
        barrels: PrismaBarrels,
        deposit: Deposit,
        barrelTransactions: CreateBarrelTransactions,
        provisionsTransactions: CreateProvisionsTransactions,
        prisma: PrismaService,
        eventStore: DomainEventService,
      ) =>
        new TransactionService(
          { transactions, barrels },
          { deposit, barrelTransactions, provisionsTransactions },
          prisma,
          eventStore,
        ),
      inject: [
        PrismaTransactions,
        PrismaBarrels,
        Deposit,
        CreateBarrelTransactions,
        CreateProvisionsTransactions,
        PrismaService,
        DomainEventService,
      ],
    },
    {
      provide: PrismaTransfers,
      useFactory: (prisma: PrismaService) => new PrismaTransfers(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaTransferMembers,
      useFactory: (prisma: PrismaService) => new PrismaTransferMembers(prisma),
      inject: [PrismaService],
    },
    {
      provide: Transfer,
      useFactory: (
        transferRepository: PrismaTransfers,
        memberRepository: PrismaTransferMembers,
      ) => new Transfer(transferRepository, memberRepository),
      inject: [PrismaTransfers, PrismaTransferMembers],
    },
    {
      provide: TransferService,
      useFactory: (transfer: Transfer) => new TransferService(transfer),
      inject: [Transfer],
    },
  ],
  imports: [PrismaModule, DomainEventModule],
})
export class TransactionModule {}
