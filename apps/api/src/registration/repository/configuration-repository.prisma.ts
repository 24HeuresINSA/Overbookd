import { PrismaService } from "../../prisma.service";
import { Configurations } from "./configurations.repository";

const INVITE_STAFF_LINK = "inviteStaffLink";

export class PrismaConfigurations implements Configurations {
  constructor(private readonly prisma: PrismaService) {}

  async getInviteStaffLink(): Promise<string | undefined> {
    const configuration = await this.prisma.configuration.findUnique({
      where: { key: INVITE_STAFF_LINK },
    });
    return JSON.stringify(configuration?.value);
  }

  async saveInviteStaffLink(value: string): Promise<void> {
    await this.prisma.configuration.upsert({
      where: { key: INVITE_STAFF_LINK },
      update: { value },
      create: { key: INVITE_STAFF_LINK, value },
    });
  }
}
