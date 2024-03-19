import { Borrow, BorrowsForInit } from "@overbookd/logistic";
import { PrismaService } from "../../../prisma.service";
import { SELECT_BORROW, toBorrow } from "./borrow.query";

export class PrismaInitBorrows implements BorrowsForInit {
  constructor(private prisma: PrismaService) {}

  async add(borrow: Borrow): Promise<Borrow> {
    const created = await this.prisma.borrow.create({
      data: borrow,
      select: SELECT_BORROW,
    });
    return toBorrow(created);
  }
}
