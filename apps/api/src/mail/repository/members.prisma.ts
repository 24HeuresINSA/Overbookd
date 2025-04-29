import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";
import { PrismaService } from "../../prisma.service";
import { Member, Members } from "../mail.service";

export class PrismaMembers implements Members {
  constructor(private readonly prisma: PrismaService) {}

  byId(id: number): Promise<Member | null> {
    return this.prisma.user.findUnique({
      where: { id, ...IS_NOT_DELETED },
      select: { email: true, firstname: true, lastname: true, nickname: true },
    });
  }
}
