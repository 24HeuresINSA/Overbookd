import {
  DRAFT,
  FestivalTask,
  FestivalTaskDraft,
  PreviewFestivalTaskDraft,
  Contact,
  Volunteer,
  PreviewFestivalTask,
} from "@overbookd/festival-event";
import { DatabaseFestivalActivity } from "./festival-activity/festival-activity.query";
import { FestivalActivityBuilder } from "./festival-activity/festival-activity.builder";

type VisualizeFestivalTask<
  Task extends FestivalTask = FestivalTask,
  Preview extends PreviewFestivalTask = PreviewFestivalTask,
> = {
  preview: Preview;
  festivalTask: Task;
};

type FestivalTaskWithoutStatus = Omit<FestivalTask, "status">;

type DatabaseFestivalTask = {
  id: FestivalTask["id"];
  status: FestivalTask["status"];
  name: FestivalTask["general"]["name"];
  teamCode: FestivalTask["general"]["team"];
  administrator: FestivalTask["general"]["administrator"];
  appointment: FestivalTask["instructions"]["appointment"];
  festivalActivity: DatabaseFestivalActivity;
  contacts: { contact: Contact }[];
  globalInstruction: FestivalTask["instructions"]["global"];
  inChargeInstruction: FestivalTask["instructions"]["inCharge"]["instruction"];
  inChargeVolunteers: { volunteer: Volunteer }[];
};

export class FestivalTaskBuilder<T extends FestivalTask> {
  constructor(protected readonly task: T) {}

  static fromDatabase(taskData: DatabaseFestivalTask): VisualizeFestivalTask {
    const activityWithoutStatus = this.buildTaskWithoutStatus(taskData);

    return DraftBuilder.init(activityWithoutStatus);
    /*switch (taskData.status) {
      case DRAFT:
        return DraftBuilder.init(activityWithoutStatus);
      case IN_REVIEW:
      case VALIDATED:
      case REFUSED:
        return ReviewableBuilder.init(activityWithoutStatus);
    }*/
  }

  protected static buildTaskWithoutStatus(
    taskData: DatabaseFestivalTask,
  ): FestivalTaskWithoutStatus {
    return {
      id: taskData.id,
      general: {
        name: taskData.name,
        administrator: taskData.administrator,
        team: taskData.teamCode,
      },
      instructions: {
        appointment: taskData.appointment,
        contacts: taskData.contacts.map(({ contact }) => contact),
        global: taskData.globalInstruction,
        inCharge: {
          volunteers: taskData.inChargeVolunteers.map(
            ({ volunteer }) => volunteer,
          ),
          instruction: taskData.inChargeInstruction,
        },
      },
      festivalActivity: FestivalActivityBuilder.fromDatabase(
        taskData.festivalActivity,
      ),
      gearInquiries: [],
      mobilizations: [],
      feedbacks: [],
      history: [],
    };
  }
}

export class DraftBuilder
  extends FestivalTaskBuilder<FestivalTaskDraft>
  implements VisualizeFestivalTask<FestivalTaskDraft, PreviewFestivalTaskDraft>
{
  static init(taskWithoutStatus: FestivalTaskWithoutStatus) {
    return new DraftBuilder({ ...taskWithoutStatus, status: DRAFT });
  }

  static fromDatabase(
    taskData: DatabaseFestivalTask,
  ): VisualizeFestivalTask<FestivalTaskDraft, PreviewFestivalTask> {
    const taskWithoutStatus = this.buildTaskWithoutStatus(taskData);
    return this.init(taskWithoutStatus);
  }

  get preview(): PreviewFestivalTaskDraft {
    return {
      id: this.task.id,
      name: this.task.general.name,
      status: this.task.status,
      administrator: this.task.general.administrator,
      team: this.task.general.team,
    };
  }

  get festivalTask(): FestivalTaskDraft {
    return this.task;
  }
}
