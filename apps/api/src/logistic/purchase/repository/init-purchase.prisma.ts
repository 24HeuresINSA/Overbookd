import { Purchase, PurchasesForInit } from "@overbookd/logistic";
import {
  PurchaseQueryBuilder,
  SELECT_PURCHASE,
  toPurchase,
} from "./purchase.query";
import { PrismaService } from "../../../prisma.service";

export class PrismaInitPurchases implements PurchasesForInit {
  constructor(private prisma: PrismaService) {}

  async add(purchase: Purchase): Promise<Purchase> {
    const created = await this.prisma.purchase.create({
      data: PurchaseQueryBuilder.create(purchase),
      select: SELECT_PURCHASE,
    });
    return toPurchase(created);
  }
}
