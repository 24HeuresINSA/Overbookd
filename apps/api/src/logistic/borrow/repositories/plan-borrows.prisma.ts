import { Borrow, BorrowsForPlan } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { BorrowQueryBuilder, SELECT_BORROW, toBorrow } from "./borrow.query";

export class PrismaPlanBorrows implements BorrowsForPlan {
  constructor(private prisma: PrismaService) {}

  async find(id: number): Promise<Borrow | undefined> {
    const borrow = await this.prisma.borrow.findUnique({
      where: { id },
      select: SELECT_BORROW,
    });
    if (!borrow) return undefined;
    return toBorrow(borrow);
  }

  async save(borrow: Borrow): Promise<Borrow> {
    const saved = await this.prisma.borrow.update({
      where: { id: borrow.id },
      data: BorrowQueryBuilder.update(borrow),
      select: SELECT_BORROW,
    });
    return toBorrow(saved);
  }
}
