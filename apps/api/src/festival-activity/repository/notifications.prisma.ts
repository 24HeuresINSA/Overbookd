import {
  Notifications,
  Notifyee,
  WaitingForReview,
} from "@overbookd/festival-activity";
import { PrismaService } from "../../prisma.service";
import { Logger } from "@nestjs/common";

export class PrismaNotifications implements Notifications {
  constructor(private readonly prisma: PrismaService) {}

  private readonly logger = new Logger(PrismaNotifications.name);

  add(event: WaitingForReview): Promise<Notifyee[]> {
    const notifications = event.reviewers.map((team) => ({
      team,
      event: { id: event.id, name: event.name },
    }));
    this.logger.log("We expect to store some notifications");
    this.logger.debug(JSON.stringify(notifications));
    return Promise.resolve([]);
  }
}
