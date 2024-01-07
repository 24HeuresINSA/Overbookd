import { Module } from "@nestjs/common";
import { Transfer } from "@overbookd/personal-account";
import { TransactionService } from "./transaction.service";
import { TransactionController } from "./transaction.controller";
import { PrismaService } from "../prisma.service";
import { PrismaModule } from "../prisma.module";
import { PrismaTransferRepository } from "./repository/transfer-repository.prisma";
import { PrismaMemberRepository } from "./repository/member-repository.prisma";
import { TransferService } from "./transfer.service";
import { PrismaTransactionRepository } from "./repository/transaction-repository.prisma";
import { DomainEventModule } from "../domain-event/domain-event.module";
import { DomainEventService } from "../domain-event/domain-event.service";

@Module({
  controllers: [TransactionController],
  providers: [
    {
      provide: PrismaTransactionRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaTransactionRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: TransactionService,
      useFactory: (
        transactions: PrismaTransactionRepository,
        prisma: PrismaService,
        eventStore: DomainEventService,
      ) => new TransactionService(transactions, prisma, eventStore),
      inject: [PrismaTransactionRepository, PrismaService, DomainEventService],
    },
    {
      provide: PrismaTransferRepository,
      useFactory: (prisma: PrismaService) =>
        new PrismaTransferRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaMemberRepository,
      useFactory: (prisma: PrismaService) => new PrismaMemberRepository(prisma),
      inject: [PrismaService],
    },
    {
      provide: Transfer,
      useFactory: (
        transferRepository: PrismaTransferRepository,
        memberRepository: PrismaMemberRepository,
      ) => new Transfer(transferRepository, memberRepository),
      inject: [PrismaTransferRepository, PrismaMemberRepository],
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
