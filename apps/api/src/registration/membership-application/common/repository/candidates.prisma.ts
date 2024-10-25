import { Candidate, Candidates, Membership } from "@overbookd/registration";
import { PrismaService } from "../../../../prisma.service";

export class PrismaCandidates implements Candidates {
  constructor(private readonly prisma: PrismaService) {}

  async isCandidate(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<boolean> {
    const application = await this.prisma.membershipApplication.findFirst({
      where: {
        user: { email },
        edition,
        membership,
      },
    });
    return application !== null;
  }

  async isRejected(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<boolean> {
    const rejectedApplication =
      await this.prisma.membershipApplication.findFirst({
        where: {
          user: { email },
          edition,
          membership,
          isRejected: true,
        },
      });
    return rejectedApplication !== null;
  }

  async add({
    email,
    edition,
    membership,
    isRejected,
    candidatedAt,
  }: Candidate): Promise<void> {
    await this.prisma.membershipApplication.create({
      data: {
        user: { connect: { email } },
        edition,
        membership,
        isRejected,
        candidatedAt,
      },
    });
  }

  async reject(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<void> {
    await this.prisma.membershipApplication.updateMany({
      where: { user: { email }, edition, membership },
      data: { isRejected: true },
    });
  }

  async cancelRejection(
    email: string,
    edition: number,
    membership: Membership,
  ): Promise<void> {
    await this.prisma.membershipApplication.updateMany({
      where: { user: { email }, edition, membership },
      data: { isRejected: false },
    });
  }
}
