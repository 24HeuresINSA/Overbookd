import { Purchase } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { PurchasesForView } from "../purchase.service";
import { SELECT_PURCHASE, toPurchase } from "./purchase.query";

export class PrismaViewPurchases implements PurchasesForView {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Purchase[]> {
    const purchases = await this.prisma.purchase.findMany({
      select: SELECT_PURCHASE,
    });
    return purchases.map(toPurchase);
  }

  async findOne(id: number): Promise<Purchase | undefined> {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id },
      select: SELECT_PURCHASE,
    });
    if (!purchase) return undefined;
    return toPurchase(purchase);
  }
}
