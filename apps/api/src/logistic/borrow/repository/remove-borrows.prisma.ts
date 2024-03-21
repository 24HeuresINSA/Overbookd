import { PrismaService } from "../../../prisma.service";
import { BorrowsForRemove } from "../borrow.service";

export class PrismaRemoveBorrows implements BorrowsForRemove {
  constructor(private prisma: PrismaService) {}

  async remove(id: number): Promise<void> {
    await this.prisma.borrow.delete({ where: { id } });
  }
}
