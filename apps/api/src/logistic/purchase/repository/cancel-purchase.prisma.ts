import { PurchasesForCancel } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";

export class PrismaCancelPurchases implements PurchasesForCancel {
  constructor(private prisma: PrismaService) {}

  async remove(id: number): Promise<void> {
    await this.prisma.purchase.delete({ where: { id } });
  }
}
