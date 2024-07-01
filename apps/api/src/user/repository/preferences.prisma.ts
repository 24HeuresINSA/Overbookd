import { Preference } from "@overbookd/http";
import { PrismaService } from "../../prisma.service";
import { Preferences } from "../preference.service";

export class PrismaPreferences implements Preferences {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(userId: number): Promise<Preference> {
    const defaultPreference = { paperPlanning: null };
    const preference = await this.prisma.preference.findUnique({
      where: { userId },
    });
    return preference || defaultPreference;
  }

  async save(userId: number, preference: Preference): Promise<Preference> {
    return this.prisma.preference.upsert({
      where: { userId },
      update: preference,
      create: { userId, ...preference },
    });
  }
}
