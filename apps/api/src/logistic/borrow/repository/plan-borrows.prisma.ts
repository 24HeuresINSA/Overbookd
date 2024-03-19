import { Borrow, BorrowsForPlan } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { SELECT_BORROW } from "./borrow.query";

export class PrismaPlanBorrows implements BorrowsForPlan {
  constructor(private prisma: PrismaService) {}

  async find(id: number): Promise<Borrow | undefined> {
    return this.prisma.borrow.findUnique({
      where: { id },
      select: SELECT_BORROW,
    });
  }

  async save(borrow: Borrow): Promise<Borrow> {
    return this.prisma.borrow.update({
      where: { id: borrow.id },
      data: borrow,
      select: SELECT_BORROW,
    });
  }
}
