import {
  CandidateToEnroll,
  JoinableTeam,
  Memberships,
  JoinedTeam,
} from "@overbookd/registration";
import { BENEVOLE_CODE } from "@overbookd/team-constants";
import { PrismaService } from "../../../../prisma.service";
import { toStandAloneUser } from "../../../../user/to-stand-alone-user";
import { SELECT_USER_IDENTIFIER } from "../../../../common/query/user.query";

export class PrismaMemberships implements Memberships {
  constructor(private readonly prisma: PrismaService) {}

  join(teams: [JoinableTeam, typeof BENEVOLE_CODE]) {
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
