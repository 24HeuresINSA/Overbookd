import { Candidate, Candidates, STAFF } from "@overbookd/registration";
import { PrismaService } from "../../../../prisma.service";

export class PrismaCandidates implements Candidates {
  constructor(private readonly prisma: PrismaService) {}

  async isCandidate(email: string, edition: number): Promise<boolean> {
    const application = await this.prisma.membershipApplication.findFirst({
      where: {
        user: { email },
        edition,
        membership: STAFF,
        isRejected: false,
      },
    });
    return application !== null;
  }

  async hasRejectedApplication(
    email: string,
    edition: number,
  ): Promise<boolean> {
    const rejectedApplication =
      await this.prisma.membershipApplication.findFirst({
        where: {
          user: { email },
          edition,
          membership: STAFF,
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
  }: Candidate): Promise<void> {
    await this.prisma.membershipApplication.create({
      data: {
        user: { connect: { email } },
        edition,
        membership,
        isRejected,
      },
    });
  }

  async reject(email: string, edition: number): Promise<void> {
    await this.prisma.membershipApplication.updateMany({
      where: { user: { email }, edition },
      data: { isRejected: true },
    });
  }
}
