import { MemberLeaving, MembershipsLeaving } from "@overbookd/access-manager";
import { PrismaService } from "../../prisma.service";

export class PrismaMembershipsLeaving implements MembershipsLeaving {
  constructor(private readonly prisma: PrismaService) {}

  leave(team: string) {
    return {
      as: async (member: MemberLeaving) => {
        await this.prisma.userTeam.delete({
          where: { userId_teamCode: { userId: member.id, teamCode: team } },
        });
      },
    };
  }

  is(member: MemberLeaving["id"]) {
    return {
      memberOf: async (team: string) => {
        const membership = await this.prisma.userTeam.findUnique({
          where: { userId_teamCode: { userId: member, teamCode: team } },
        });
        return membership !== null;
      },
    };
  }
}
