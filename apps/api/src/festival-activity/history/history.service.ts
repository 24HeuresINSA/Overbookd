import { OnApplicationBootstrap } from "@nestjs/common";
import { Created } from "@overbookd/festival-activity";
import { DomainEventService } from "../../domain-event/domain-event.service";

export type Events = {
  save(created: Created): Promise<void>;
};

export class HistoryService implements OnApplicationBootstrap {
  constructor(
    private readonly events: Events,
    private readonly eventStore: DomainEventService,
  ) {}

  onApplicationBootstrap() {
    this.eventStore.createdFestivalActivity.subscribe((event) =>
      this.persistCreated(event),
    );
  }

  async persistCreated(created: Created) {
    await this.events.save(created);
  }
}
