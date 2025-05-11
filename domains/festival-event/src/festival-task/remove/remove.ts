import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { FestivalTask } from "../festival-task";
import { RemoveReadyToAssignError } from "../festival-task.error";

export type FestivalTasksForRemoval = {
  findStatus: (
    id: FestivalTask["id"],
  ) => Promise<FestivalTask["status"] | null>;
  one(id: FestivalTask["id"]): Promise<void>;
};
export class RemoveFestivalTask {
  constructor(private readonly remove: FestivalTasksForRemoval) {}

  async apply(id: FestivalTask["id"]): Promise<void> {
    const status = await this.remove.findStatus(id);
    if (status === null) return;
    if (status === READY_TO_ASSIGN) throw new RemoveReadyToAssignError(id);
    await this.remove.one(id);
  }
}
