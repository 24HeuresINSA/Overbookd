import { Module } from "@nestjs/common";
import { BorrowController } from "./borrow.controller";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { CancelBorrow, InitBorrow, PlanBorrow } from "@overbookd/logistic";
import { PrismaInitBorrows } from "./repositories/init-borrows.prisma";
import { PrismaPlanBorrows } from "./repositories/plan-borrows.prisma";
import { BorrowService, BorrowsForView } from "./borrow.service";
import { FindGears, PrismaFindGears } from "./repositories/find-gears.prisma";
import { PrismaViewBorrows } from "./repositories/view-borrows.prisma";
import { PrismaCancelBorrows } from "./repositories/cancel-borrows.prisma";

@Module({
  controllers: [BorrowController],
  providers: [
    {
      provide: PrismaFindGears,
      useFactory: (prisma: PrismaService) => new PrismaFindGears(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaViewBorrows,
      useFactory: (prisma: PrismaService) => new PrismaViewBorrows(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaInitBorrows,
      useFactory: (prisma: PrismaService) => new PrismaInitBorrows(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPlanBorrows,
      useFactory: (prisma: PrismaService) => new PrismaPlanBorrows(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaCancelBorrows,
      useFactory: (prisma: PrismaService) => new PrismaCancelBorrows(prisma),
      inject: [PrismaService],
    },
    {
      provide: InitBorrow,
      useFactory: async (borrows: PrismaInitBorrows, prisma: PrismaService) => {
        const {
          _max: { id: maxId },
        } = await prisma.borrow.aggregate({ _max: { id: true } });
        return new InitBorrow(borrows, maxId + 1);
      },
      inject: [PrismaInitBorrows, PrismaService],
    },
    {
      provide: PlanBorrow,
      useFactory: (borrows: PrismaPlanBorrows) => new PlanBorrow(borrows),
      inject: [PrismaPlanBorrows],
    },
    {
      provide: CancelBorrow,
      useFactory: (borrows: PrismaCancelBorrows) => new CancelBorrow(borrows),
      inject: [PrismaCancelBorrows],
    },
    {
      provide: BorrowService,
      useFactory: (
        init: InitBorrow,
        plan: PlanBorrow,
        cancel: CancelBorrow,
        views: BorrowsForView,
        gears: FindGears,
      ) => new BorrowService({ init, plan, cancel }, { views, gears }),
      inject: [
        InitBorrow,
        PlanBorrow,
        CancelBorrow,
        PrismaViewBorrows,
        PrismaFindGears,
      ],
    },
  ],
  imports: [PrismaModule],
})
export class BorrowModule {}
