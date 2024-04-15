import { BorrowsForCancel } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";

export class PrismaCancelBorrows implements BorrowsForCancel {
  constructor(private prisma: PrismaService) {}

  async remove(id: number): Promise<void> {
    await this.prisma.borrow.delete({ where: { id } });
  }
}
