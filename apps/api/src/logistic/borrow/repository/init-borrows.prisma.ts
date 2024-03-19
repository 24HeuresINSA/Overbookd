import { Borrow, BorrowsForInit } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { SELECT_BORROW } from "./borrow.query";

export class PrismaInitBorrows implements BorrowsForInit {
  constructor(private prisma: PrismaService) {}

  async add(borrow: Borrow): Promise<Borrow> {
    return this.prisma.borrow.create({
      data: borrow,
      select: SELECT_BORROW,
    });
  }
}
