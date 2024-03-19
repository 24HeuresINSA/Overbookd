import { Borrow } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { BorrowsForView } from "../borrow.service";
import { SELECT_BORROW, toBorrow } from "./borrow.query";

export class PrismaViewBorrows implements BorrowsForView {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Borrow[]> {
    const borrows = this.prisma.borrow.findMany({ select: SELECT_BORROW });
    return borrows.map(toBorrow);
  }

  async findOne(id: number): Promise<Borrow | undefined> {
    const borrow = await this.prisma.borrow.findUnique({
      where: { id },
      select: SELECT_BORROW,
    });
    if (!borrow) return undefined;
    return toBorrow(borrow);
  }
}
