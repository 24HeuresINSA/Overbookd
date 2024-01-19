import { FestivalTaskDraft } from "@overbookd/festival-event";

type VisualizeFestivalTask<
  Activity extends FestivalActivity = FestivalActivity,
  Preview extends PreviewFestivalActivity = PreviewFestivalTask,
> = {
  preview: Preview;
  festivalActivity: Activity;
};

export class DraftBuilder
  extends FestivalTaskBuilder<FestivalTaskDraft>
  implements VisualizeFestivalTask<FestivalTaskDraft, PreviewDraft>
{
  static init(taskWithoutStatus: FestivalTaskWithoutStatus) {
    return new DraftBuilder({ ...taskWithoutStatus, status: DRAFT });
  }

  static fromDatabase(
    taskData: DatabaseFestivalTask,
  ): VisualizeFestivalTask<FestivalTaskDraft, PreviewDraft> {
    const taskWithoutStatus = this.buildTaskWithoutStatus(taskData);
    return this.init(taskWithoutStatus);
  }

  get preview() {
    return {
      id: this.task.id,
      name: this.task.general.name,
      status: this.task.status,
      adherent: this.task.inCharge.adherent,
      team: this.task.inCharge.team,
    };
  }

  get festivalTask() {
    return this.task;
  }
}
