import { ReviewerStat, Reviewers } from "@overbookd/festival-event";
import { PrismaService } from "../../../prisma.service";
import { SELECT_VOLUNTEER } from "./adherent/adherent.query";

export class PrismaReviewers implements Reviewers {
  constructor(private readonly prisma: PrismaService) {}

  async getAll(): Promise<ReviewerStat[]> {
    const reviewers = await this.prisma.user.findMany({
      select: {
        ...SELECT_VOLUNTEER,
        _count: {
          select: { festivalTasksToReview: true },
        },
      },
    });

    return reviewers.map((reviewer) => ({
      adherent: {
        id: reviewer.id,
        firstname: reviewer.firstname,
        lastname: reviewer.lastname,
        nickname: reviewer.nickname,
      },
      count: reviewer._count.festivalTasksToReview,
    }));
  }
}
