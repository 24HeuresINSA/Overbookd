import {
  AdherentRegistered,
  FilterNotifyees,
  NotificationRepository,
  Notifyee,
} from "@overbookd/registration";
import { PrismaService } from "../../prisma.service";
import { SELECT_NOTIFYEE } from "./notification.query";
import { HAS_PERMISSION } from "./notification.query";

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async add(
    event: AdherentRegistered,
    clause: FilterNotifyees,
  ): Promise<Notifyee[]> {
    const notifyees = await this.findNotifyees(clause);

    await this.generateNotifications(notifyees);
    return notifyees;
  }

  private async generateNotifications(notifyees: Notifyee[]) {
    return this.prisma.notification.createMany({
      data: notifyees.map(({ id }) => ({ userId: id })),
      skipDuplicates: true,
    });
  }

  private async findNotifyees(clause: FilterNotifyees) {
    const where = HAS_PERMISSION(clause.havePermission);
    const select = SELECT_NOTIFYEE;
    return this.prisma.user.findMany({ where, select });
  }
}
