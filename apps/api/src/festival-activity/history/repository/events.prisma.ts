import {
  Approved,
  Created,
  ReadyToReview,
  Rejected,
} from "@overbookd/festival-activity";
import { Events } from "../history.service";
import { PrismaService } from "../../../prisma.service";
import { Prisma } from "@prisma/client";

const CREATED = "CREATED";
const READY_TO_REVIEW = "READY_TO_REVIEW";
const APPROVED = "APPROVED";
const REJECTED = "REJECTED";

type FestivalActivityEventType =
  | typeof CREATED
  | typeof READY_TO_REVIEW
  | typeof APPROVED
  | typeof REJECTED;

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

  private generateDatabaseEvent(
    { id, by, festivalActivity, at }: FestivalActivityEvent,
    type: FestivalActivityEventType,
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
