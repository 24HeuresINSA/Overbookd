import {
  CandidateToEnroll,
  JoinableTeam,
  JoinedTeam,
  Memberships,
} from "@overbookd/registration";
import { PERSONNE } from "@overbookd/team-constants";
import { toStandAloneUser } from "@overbookd/user";
import { SELECT_USER_IDENTIFIER } from "../../../../common/query/user.query";
import { PrismaService } from "../../../../prisma.service";

export class PrismaMemberships implements Memberships {
  constructor(private readonly prisma: PrismaService) {}

  join(teams: [JoinableTeam, typeof PERSONNE]) {
    return {
      as: async (candidates: CandidateToEnroll[]) => {
        await this.prisma.userTeam.createMany({
          data: candidates.flatMap((candidate) =>
            teams.map((teamCode) => ({ userId: candidate.id, teamCode })),
          ),
          skipDuplicates: true,
        });
      },
    };
  }

  enrolledIn(team: JoinedTeam) {
    return {
      among: async (candidates: CandidateToEnroll[]) => {
        const candidateIds = candidates.map(({ id }) => id);
        const teams = { some: { teamCode: team } };

        const enrolledCandidates = await this.prisma.user.findMany({
          where: { id: { in: candidateIds }, teams },
          select: SELECT_USER_IDENTIFIER,
        });
        return enrolledCandidates.map(toStandAloneUser);
      },
    };
  }
}
