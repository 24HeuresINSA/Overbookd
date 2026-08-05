import { Edition } from "@overbookd/time";
import { PrismaService } from "../../../prisma.service";
import { MembershipApplicationForRegistrationRepository } from "../registration.service";

export class PrismaMembershipApplicationForRegistrationRepository implements MembershipApplicationForRegistrationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async hasValidApplication(id: number): Promise<boolean> {
    const application = await this.prisma.membershipApplication.findFirst({
      where: {
        user: { id },
        edition: Edition.current,
      },
    });
    return application !== null;
  }
}
