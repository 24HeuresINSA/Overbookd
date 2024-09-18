import { Candidate, Candidates, STAFF } from "@overbookd/registration";
import { PrismaService } from "../../../prisma.service";

export class PrismaCandidates implements Candidates {
  constructor(private readonly prisma: PrismaService) {}

  async isCandidate(email: string, edition: number): Promise<boolean> {
    const candidate = await this.prisma.membershipApplication.findFirst({
      where: {
        user: { email },
        edition,
        membership: STAFF,
      },
    });
    return candidate !== null;
  }

  async add({ email, edition, membership }: Candidate): Promise<void> {
    await this.prisma.membershipApplication.create({
      data: {
        user: { connect: { email } },
        edition,
        membership,
      },
    });
  }
}
