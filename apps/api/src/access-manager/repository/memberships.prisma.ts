import { Member, Memberships } from "@overbookd/access-manager";
import { PrismaService } from "../../prisma.service";

export class PrismaMemberships implements Memberships {
  constructor(private prisma: PrismaService) {}

  all(teams: string[]): { exist: () => Promise<boolean> } {
    return {
      exist: async () => {
        const existingTeams = await this.prisma.team.count({
          where: { code: { in: teams } },
        });
        return existingTeams === teams.length;
      },
    };
  }

  is(member: Member["id"]): { memberOf(teams: string[]): Promise<boolean> } {
    return {
      memberOf: async (teams: string[]) => {
        const memberOfTeams = await this.prisma.userTeam.count({
          where: { userId: member, teamCode: { in: teams } },
        });
        return memberOfTeams === teams.length;
      },
    };
  }

  join(teams: string[]): { as: (member: Member) => Promise<void> } {
    return {
      as: async (member: Member) => {
        await this.prisma.userTeam.createMany({
          data: teams.map((teamCode) => ({ userId: member.id, teamCode })),
          skipDuplicates: true,
        });
      },
    };
  }
}
