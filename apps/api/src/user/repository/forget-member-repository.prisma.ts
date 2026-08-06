import { AnonymousMember, MemberRepository } from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";
import { SELECT_TRANSACTIONS_FOR_BALANCE } from "../../common/query/transaction.query";
import { Balance } from "@overbookd/personal-account";
import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";

export class PrismaForgetMemberRepository implements MemberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async hasFutureAssignments(id: number): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        id,
        assigned: { some: { assignment: { end: { gt: new Date() } } } },
      },
    });
    return user !== null;
  }

  async activityIds(id: number): Promise<number[]> {
    const activities = await this.prisma.festivalActivity.findMany({
      where: { adherentId: id },
      select: { id: true },
    });
    return activities.map((a) => a.id);
  }

  async taskIds(id: number): Promise<number[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: {
        OR: [
          { administratorId: id },
          { contactId: id },
          { inChargeId: id },
          { mobilizationId: id },
        ],
      },
      select: { id: true },
    });
    return tasks.map((t) => t.id);
  }

  async openSharedMealDates(id: number): Promise<string[]> {
    const sharedMeals = await this.prisma.sharedMeal.findMany({
      where: { adherentId: id, closedAt: null },
      select: { date: true },
    });
    return sharedMeals.map((sm) => sm.date);
  }

  async hasDebts(id: number): Promise<boolean> {
    const balance = await this.getBalance(id);
    return balance < 0;
  }

  async hasMoney(id: number): Promise<boolean> {
    const balance = await this.getBalance(id);
    return balance > 0;
  }

  private async getBalance(id: number): Promise<number> {
    const user = await this.prisma.user.findFirst({
      where: { id },
      select: SELECT_TRANSACTIONS_FOR_BALANCE,
    });
    return Balance.calculate(user);
  }

  async hasTransactions(id: number): Promise<boolean> {
    const transactions = await this.prisma.transaction.count({
      where: {
        ...IS_NOT_DELETED,
        OR: [{ payor: { id } }, { payee: { id } }],
      },
    });
    return transactions > 0;
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async anonymize(
    id: number,
    anonymous: AnonymousMember,
  ): Promise<AnonymousMember> {
    await this.prisma.user.update({
      where: { id },
      data: {
        zitadelId: anonymous.oidcId,
        firstName: anonymous.firstName,
        lastName: anonymous.lastName,
        phoneNumber: anonymous.mobilePhone,
        birthDate: anonymous.birthDate,
        nickname: anonymous.nickname,
        comment: anonymous.comment,
        note: anonymous.note,
        email: anonymous.email,

        hasApprovedEULA: false,
        hasSignedVolunteerCharter: false,
        profilePicture: null,
        registrationMembership: null,

        teams: { deleteMany: {} },
        preference: { delete: {} },
        contributions: { deleteMany: {} },
        friends: { deleteMany: {} },
        friendRequestors: { deleteMany: {} },
        membershipApplications: { deleteMany: {} },

        availabilities: { deleteMany: {} },
        breaks: { deleteMany: {} },

        shotguns: { deleteMany: {} },
        chefMeals: { deleteMany: {} },
        charismaEventParticipations: { deleteMany: {} },

        faFeedbacks: { deleteMany: {} },
        ftFeedbacks: { deleteMany: {} },
        festivalActivityInstigations: { deleteMany: {} },
        festivalTaskInstigations: { deleteMany: {} },
        festivalTasksToReview: { deleteMany: {} },
      },
    });
    return anonymous;
  }
}
