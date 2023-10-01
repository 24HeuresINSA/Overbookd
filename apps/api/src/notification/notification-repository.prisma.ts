import { PrismaService } from "../prisma.service";
import { NotificationRepository } from "./notification.service";

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async someFor(userId: number): Promise<boolean> {
    const hasNotification = await this.prisma.notification.findFirst({
      where: { userId },
    });
    return hasNotification ? true : false;
  }

  async readFrom(userId: number): Promise<void> {
    await this.prisma.notification.deleteMany({ where: { userId } });
  }
}
