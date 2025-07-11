import { Module } from "@nestjs/common";
import { PurchaseController } from "./purchase.controller";
import { PurchaseService, PurchasesForView } from "./purchase.service";
import {
  CancelPurchase,
  InitPurchase,
  PlanPurchase,
} from "@overbookd/logistic";
import { PrismaInitPurchases } from "./repository/init-purchase.prisma";
import { PrismaModule } from "../../prisma.module";
import { PrismaPlanPurchases } from "./repository/plan-purchase.prisma";
import { PrismaCancelPurchases } from "./repository/cancel-purchase.prisma";
import { LogisticCommonModule } from "../common/logistic-common.module";
import {
  FindGears,
  PrismaFindGears,
} from "../common/repositories/find-gears.prisma";
import { PrismaService } from "../../prisma.service";
import { PrismaViewPurchases } from "./repository/view-purchases.prisma";

@Module({
  controllers: [PurchaseController],
  providers: [
    {
      provide: PrismaViewPurchases,
      useFactory: (prisma: PrismaService) => new PrismaViewPurchases(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaInitPurchases,
      useFactory: (prisma: PrismaService) => new PrismaInitPurchases(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaPlanPurchases,
      useFactory: (prisma: PrismaService) => new PrismaPlanPurchases(prisma),
      inject: [PrismaService],
    },
    {
      provide: PrismaCancelPurchases,
      useFactory: (prisma: PrismaService) => new PrismaCancelPurchases(prisma),
      inject: [PrismaService],
    },
    {
      provide: InitPurchase,
      useFactory: async (
        purchases: PrismaInitPurchases,
        prisma: PrismaService,
      ) => {
        const {
          _max: { id: maxId },
        } = await prisma.purchase.aggregate({ _max: { id: true } });
        return new InitPurchase(purchases, maxId + 1);
      },
      inject: [PrismaInitPurchases, PrismaService],
    },
    {
      provide: PlanPurchase,
      useFactory: (purchases: PrismaPlanPurchases) =>
        new PlanPurchase(purchases),
      inject: [PrismaPlanPurchases],
    },
    {
      provide: CancelPurchase,
      useFactory: (purchases: PrismaCancelPurchases) =>
        new CancelPurchase(purchases),
      inject: [PrismaCancelPurchases],
    },
    {
      provide: PurchaseService,
      useFactory: (
        init: InitPurchase,
        plan: PlanPurchase,
        cancel: CancelPurchase,
        views: PurchasesForView,
        gears: FindGears,
      ) => new PurchaseService({ init, plan, cancel }, { views, gears }),
      inject: [
        InitPurchase,
        PlanPurchase,
        CancelPurchase,
        PrismaViewPurchases,
        PrismaFindGears,
      ],
    },
  ],
  imports: [PrismaModule, LogisticCommonModule],
})
export class PurchaseModule {}
