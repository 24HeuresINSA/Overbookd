import { INVITE_STAFF_LINK_KEY } from "@overbookd/configuration";
import { PrismaService } from "../../../../prisma.service";
import { Configurations } from "./configurations";

export class PrismaConfigurations implements Configurations {
  constructor(private readonly prisma: PrismaService) {}

  async getInviteStaffLink(): Promise<string | undefined> {
    const configuration = await this.prisma.configuration.findUnique({
      where: { key: INVITE_STAFF_LINK_KEY },
    });
    return configuration?.value.toString();
  }

  async saveInviteStaffLink(value: string): Promise<void> {
    await this.prisma.configuration.upsert({
      where: { key: INVITE_STAFF_LINK_KEY },
      update: { value },
      create: { key: INVITE_STAFF_LINK_KEY, value },
    });
  }
}
