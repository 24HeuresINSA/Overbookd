import { OnApplicationBootstrap } from "@nestjs/common";
import {
  Approved,
  Created,
  ReadyToReview,
  Rejected,
} from "@overbookd/festival-activity";
import { DomainEventService } from "../../domain-event/domain-event.service";

export type Events = {
  saveCreated(created: Created): Promise<void>;
  saveReadyToReview(readyToReview: ReadyToReview): Promise<void>;
  saveApproved(approved: Approved): Promise<void>;
  saveRejected(rejected: Rejected): Promise<void>;
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
    this.eventStore.readyToReviewFestivalActivity.subscribe((event) =>
      this.persistReadyToReview(event),
    );
    this.eventStore.approvedFestivalActivity.subscribe((event) =>
      this.persistApproved(event),
    );
    this.eventStore.rejectedFestivalActivity.subscribe((event) =>
      this.persistRejected(event),
    );
  }

  async persistCreated(created: Created) {
    await this.events.saveCreated(created);
  }

  async persistReadyToReview(readyToReview: ReadyToReview) {
    await this.events.saveReadyToReview(readyToReview);
  }

  async persistApproved(approved: Approved) {
    await this.events.saveApproved(approved);
  }

  async persistRejected(rejected: Rejected) {
    this.events.saveRejected(rejected);
  }
}
