import { Candidate, Candidates, Membership } from "@overbookd/registration";
import { PrismaService } from "../../../../prisma.service";

export class PrismaCandidates implements Candidates {
  constructor(private readonly prisma: PrismaService) {}

  async isCandidate(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<boolean> {
    const application = await this.prisma.membershipApplication.findFirst({
      where: { userId: id, edition, membership },
    });
    return application !== null;
  }

  async isRejected(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<boolean> {
    const rejectedApplication =
      await this.prisma.membershipApplication.findFirst({
        where: { userId: id, edition, membership, isRejected: true },
      });
    return rejectedApplication !== null;
  }

  async add({
    id,
    edition,
    membership,
    isRejected,
    candidatedAt,
  }: Candidate): Promise<void> {
    await this.prisma.membershipApplication.create({
      data: { userId: id, edition, membership, isRejected, candidatedAt },
    });
  }

  async reject(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<void> {
    await this.prisma.membershipApplication.update({
      where: { userId_edition_membership: { userId: id, edition, membership } },
      data: { isRejected: true },
    });
  }

  async cancelRejection(
    id: Candidate["id"],
    edition: number,
    membership: Membership,
  ): Promise<void> {
    await this.prisma.membershipApplication.update({
      where: { userId_edition_membership: { userId: id, edition, membership } },
      data: { isRejected: false },
    });
  }

  async switchApplicationMembership(
    id: number,
    edition: number,
    membership: Membership,
    newMembership: Membership,
  ): Promise<void> {
    await this.prisma.membershipApplication.update({
      where: { userId_edition_membership: { userId: id, edition, membership } },
      data: { isRejected: false, membership: newMembership },
    });
  }
}
