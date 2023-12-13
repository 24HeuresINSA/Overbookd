import { Prisma } from "@prisma/client";
import {
  Approved,
  Created,
  FestivalActivity,
  ReadyToReview,
  Rejected,
} from "@overbookd/festival-activity";
import { Events } from "../history.service";
import { PrismaService } from "../../../prisma.service";
import {
  APPROVED,
  Action,
  CREATED,
  KeyEvent,
  READY_TO_REVIEW,
  REJECTED,
} from "@overbookd/http";
import { SELECT_KEY_EVENT } from "./events.query";

type FestivalActivityEvent = Approved | Created | ReadyToReview | Rejected;

export class PrismaEvents implements Events {
  constructor(private readonly prisma: PrismaService) {}

  async saveCreated(created: Created): Promise<void> {
    const data = this.generateDatabaseEvent(created, CREATED);

    await this.prisma.festivalActivityHistory.create({
      select: { id: true },
      data,
    });
  }

  async saveReadyToReview(readyToReview: ReadyToReview): Promise<void> {
    const data = this.generateDatabaseEvent(readyToReview, READY_TO_REVIEW);

    await this.prisma.festivalActivityHistory.create({
      select: { id: true },
      data,
    });
  }

  async saveApproved(approved: Approved): Promise<void> {
    const data = this.generateDatabaseEvent(approved, APPROVED);

    await this.prisma.festivalActivityHistory.create({
      select: { id: true },
      data,
    });
  }

  async saveRejected(rejected: Rejected): Promise<void> {
    const data = this.generateDatabaseEvent(rejected, REJECTED);
    const { reason } = rejected;

    await this.prisma.festivalActivityHistory.create({
      select: { id: true },
      data: { ...data, reason },
    });
  }

  async forFestivalActivity(faId: FestivalActivity["id"]): Promise<KeyEvent[]> {
    const events = await this.prisma.festivalActivityHistory.findMany({
      select: SELECT_KEY_EVENT,
      where: { faId },
    });
    return events.map(({ at, reason, event, instigator }) => {
      const description = generateDescription(event, reason);
      return { at, by: instigator, description, action: event };
    });
  }

  private generateDatabaseEvent(
    { id, by, festivalActivity, at }: FestivalActivityEvent,
    type: Action,
  ) {
    return {
      event: type,
      instigatorId: by,
      faId: id,
      snapshot: festivalActivity as unknown as Prisma.JsonObject,
      at,
    } as const;
  }
}

function generateDescription(action: Action, reason?: string) {
  switch (action) {
    case CREATED:
      return "FA créée";
    case READY_TO_REVIEW:
      return "Demande de relecture de la FA";
    case APPROVED:
      return "FA approuvée";
    case REJECTED:
      return `FA rejetée pour la raison suivante: ${reason}`;
  }
}
