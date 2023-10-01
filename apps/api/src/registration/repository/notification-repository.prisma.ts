import {
  AdherentRegistered,
  FilterNotifyees,
  NotificationRepository,
  Notifyee,
} from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async add(
    event: AdherentRegistered,
    clause: FilterNotifyees,
  ): Promise<Notifyee[]> {
    const notifyees = await this.prisma.user.findMany({
      where: {
        teams: { some: { teamCode: { equals: clause.havePermission } } },
      },
      select: {
        id: true,
      },
    });
    await this.prisma.notification.createMany({
      data: notifyees.map(({ id }) => ({ userId: id })),
      skipDuplicates: true,
    });
    return notifyees;
  }
}
