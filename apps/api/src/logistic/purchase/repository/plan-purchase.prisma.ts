import { Purchase, PurchasesForPlan } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import {
  PurchaseQueryBuilder,
  SELECT_PURCHASE,
  toPurchase,
} from "./purchase.query";

export class PrismaPlanPurchases implements PurchasesForPlan {
  constructor(private prisma: PrismaService) {}

  async find(id: number): Promise<Purchase | undefined> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      select: SELECT_PURCHASE,
    });
    if (!purchase) return undefined;
    return toPurchase(purchase);
  }

  async save(purchase: Purchase): Promise<Purchase> {
    const saved = await this.prisma.purchase.update({
      where: { id: purchase.id },
      data: PurchaseQueryBuilder.update(purchase),
      select: SELECT_PURCHASE,
    });
    return toPurchase(saved);
  }
}
