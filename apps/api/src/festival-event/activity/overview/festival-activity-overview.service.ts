import { Injectable } from "@nestjs/common";
import { FestivalActivity as FestivalActivityEvents } from "@overbookd/domain-events";
import type {
  CreateFestivalActivity,
  Draft,
  FestivalActivity,
  PrepareFestivalActivity,
} from "@overbookd/festival-event";
import { JwtPayload } from "../../../authentication/entities/jwt-util.entity";
import {
  Adherents,
  RemoveFestivalActivities,
} from "../common/festival-activity-common.model";
import { DomainEventService } from "../../../domain-event/domain-event.service";

@Injectable()
export class FestivalActivityOverviewService {
  constructor(
    private readonly adherents: Adherents,
    private readonly creation: CreateFestivalActivity,
    private readonly prepare: PrepareFestivalActivity,
    private readonly removal: RemoveFestivalActivities,
    private readonly eventStore: DomainEventService,
  ) {}

  findById(id: FestivalActivity["id"]): Promise<FestivalActivity | null> {
    return this.prepare.findById(id);
  }

  async create({ id }: JwtPayload, name: string): Promise<Draft> {
    const author = await this.adherents.find(id);
    const activity = await this.creation.create({
      author,
      name,
    });

    const event = FestivalActivityEvents.created(activity, author.id);
    this.eventStore.publish(event);

    return activity;
  }

  async remove(id: FestivalActivity["id"]): Promise<void> {
    await this.removal.remove(id);
  }
}
