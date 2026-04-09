import { Module } from "@nestjs/common";
import { CancelBorrow, InitBorrow, PlanBorrow } from "@overbookd/logistic";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { LogisticCommonModule } from "../common/logistic-common.module";
import {
  FindGears,
  PrismaFindGears,
} from "../common/repositories/find-gears.prisma";
import { BorrowController } from "./borrow.controller";
import { BorrowService, BorrowsForView } from "./borrow.service";
import { PrismaCancelBorrows } from "./repository/cancel-borrows.prisma";
import { PrismaInitBorrows } from "./repository/init-borrows.prisma";
import { PrismaPlanBorrows } from "./repository/plan-borrows.prisma";
import { PrismaViewBorrows } from "./repository/view-borrows.prisma";

@Module({
  controllers: [BorrowController],
  providers: [
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
  imports: [PrismaModule, LogisticCommonModule],
})
export class BorrowModule {}
