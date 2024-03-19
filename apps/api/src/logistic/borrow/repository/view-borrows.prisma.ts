import { Borrow } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { BorrowsForView } from "../borrow.service";
import { SELECT_BORROW } from "./borrow.query";

export class PrismaViewBorrows implements BorrowsForView {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Borrow[]> {
    return this.prisma.borrow.findMany({ select: SELECT_BORROW });
  }

  async findOne(id: number): Promise<Borrow | undefined> {
    return this.prisma.borrow.findUnique({
      where: { id },
      select: SELECT_BORROW,
    });
  }
}
