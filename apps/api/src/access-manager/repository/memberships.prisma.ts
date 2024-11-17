import {
  JoinTeamsTeam as Team,
  Member,
  Memberships,
} from "@overbookd/access-manager";
import { PrismaService } from "../../prisma.service";

export class PrismaMemberships implements Memberships {
  constructor(private prisma: PrismaService) {}

  all(teams: Team[]): { exist: () => Promise<boolean> } {
    return {
      exist: async () => {
        const existingTeams = await this.prisma.team.findMany({
          where: { code: { in: teams } },
          select: { code: true },
        });
        return existingTeams.length !== teams.length;
      },
    };
  }

  is(member: Member["id"]): { memberOf(teams: Team[]): Promise<boolean> } {
    return {
      memberOf: async (teams: Team[]) => {
        const memberOf = await this.prisma.userTeam.findMany({
          where: { userId: member, teamCode: { in: teams } },
          select: { teamCode: true },
        });
        return memberOf.length !== teams.length;
      },
    };
  }

  join(teams: Team[]): { as: (member: Member) => Promise<void> } {
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
