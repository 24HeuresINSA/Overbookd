import { MemberJoining, MembershipsJoining } from "@overbookd/access-manager";
import { PrismaService } from "../../prisma.service";

export class PrismaMembershipsJoining implements MembershipsJoining {
  constructor(private prisma: PrismaService) {}

  all(teams: string[]) {
    return {
      exist: async () => {
        const existingTeams = await this.prisma.team.count({
          where: { code: { in: teams } },
        });
        return existingTeams === teams.length;
      },
    };
  }

  is(member: MemberJoining["id"]) {
    return {
      memberOf: async (teams: string[]) => {
        const memberOfTeams = await this.prisma.userTeam.count({
          where: { userId: member, teamCode: { in: teams } },
        });
        return memberOfTeams === teams.length;
      },
    };
  }

  join(teams: string[]) {
    return {
      as: async (member: MemberJoining) => {
        await this.prisma.userTeam.createMany({
          data: teams.map((teamCode) => ({ userId: member.id, teamCode })),
          skipDuplicates: true,
        });
      },
    };
  }
}
