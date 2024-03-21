import { Module } from "@nestjs/common";
import { BorrowController } from "./borrow.controller";
import { PrismaModule } from "../../prisma.module";
import { PrismaService } from "../../prisma.service";
import { InitBorrow, PlanBorrow } from "@overbookd/logistic";
import { PrismaInitBorrows } from "./repository/init-borrows.prisma";
import { PrismaPlanBorrows } from "./repository/plan-borrows.prisma";
import {
  BorrowService,
  BorrowsForRemove,
  BorrowsForView,
  Gears,
} from "./borrow.service";
import { PrismaGears } from "./repository/gears.prisma";
import { PrismaViewBorrows } from "./repository/view-borrows.prisma";
import { PrismaRemoveBorrows } from "./repository/remove-borrows.prisma";

@Module({
  controllers: [BorrowController],
  providers: [
    {
      provide: PrismaGears,
      useFactory: (prisma: PrismaService) => new PrismaGears(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaViewBorrows,
      useFactory: (prisma: PrismaService) => new PrismaViewBorrows(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaRemoveBorrows,
      useFactory: (prisma: PrismaService) => new PrismaRemoveBorrows(prisma),
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
      provide: InitBorrow,
      useFactory: (borrows: PrismaInitBorrows) => new InitBorrow(borrows),
      inject: [PrismaInitBorrows],
    },
    {
      provide: PlanBorrow,
      useFactory: (borrows: PrismaPlanBorrows) => new PlanBorrow(borrows),
      inject: [PrismaPlanBorrows],
    },
    {
      provide: BorrowService,
      useFactory: (
        init: InitBorrow,
        plan: PlanBorrow,
        views: BorrowsForView,
        removes: BorrowsForRemove,
        gears: Gears,
      ) => new BorrowService({ init, plan }, { views, removes, gears }),
      inject: [
        InitBorrow,
        PlanBorrow,
        PrismaViewBorrows,
        PrismaPlanBorrows,
        PrismaGears,
      ],
    },
  ],
  imports: [PrismaModule],
})
export class BorrowModule {}
