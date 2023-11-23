import { PrismaService } from "../prisma.service";
import { NotificationRepository, Notifications } from "./notification.service";

export class PrismaNotificationRepository implements NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async for(userId: number): Promise<Notifications> {
    const savedNotifications = await this.prisma.notification.count({
      where: { userId },
    });
    const hasNotifications = savedNotifications > 0;
    return { hasNotifications };
  }

  async readFrom(userId: number): Promise<void> {
    await this.prisma.notification.deleteMany({ where: { userId } });
  }
}
