import { INVITE_STAFF_LINK } from "@overbookd/configuration";
import { PrismaService } from "../../prisma.service";
import { Configurations } from "./configurations.repository";

export class PrismaConfigurations implements Configurations {
  constructor(private readonly prisma: PrismaService) {}

  async saveInviteStaffLink(value: string): Promise<void> {
    await this.prisma.configuration.upsert({
      where: { key: INVITE_STAFF_LINK },
      update: { value },
      create: { key: INVITE_STAFF_LINK, value },
    });
  }
}
