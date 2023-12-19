import { PrismaService } from "../../prisma.service";
import { Member, Members } from "../mail.service";

export class PrismaMembers implements Members {
  constructor(private readonly prisma: PrismaService) {}

  byId(id: number): Promise<Member | null> {
    return this.prisma.user.findUnique({
      where: { id, isDeleted: false },
      select: { email: true, firstname: true, lastname: true, nickname: true },
    });
  }
}
