import { Purchase, PurchasesForInit } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import {
  PurchaseQueryBuilder,
  SELECT_PURCHASE,
  toPurchase,
} from "./purchase.query";

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
