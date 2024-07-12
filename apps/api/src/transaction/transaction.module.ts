import { Module } from "@nestjs/common";
import { Transfer } from "@overbookd/personal-account";
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

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: PrismaTransactions,
      useFactory: (prisma: PrismaService) => new PrismaTransactions(prisma),
      inject: [PrismaService],
    },
    {
      provide: TransactionService,
      useFactory: (
        transactions: PrismaTransactions,
        prisma: PrismaService,
        eventStore: DomainEventService,
      ) => new TransactionService(transactions, prisma, eventStore),
      inject: [PrismaTransactions, PrismaService, DomainEventService],
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
