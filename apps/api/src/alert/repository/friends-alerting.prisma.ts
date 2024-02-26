import { PrismaService } from "../../prisma.service";
import { User } from "@overbookd/user";
import { FriendsAlerting } from "../alert.service";

export class PrismaFriendsAlerting implements FriendsAlerting {
  constructor(private readonly prisma: PrismaService) {}

  async for(id: User["id"]): Promise<boolean> {
    const count = await this.prisma.friend.count({
      where: {
        OR: [{ friendId: id }, { requestorId: id }],
      },
    });
    return count > 0;
  }
}
