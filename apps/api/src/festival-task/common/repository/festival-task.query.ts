import { FestivalTask, FestivalTaskDraft } from "@overbookd/festival-event";

export const SELECT_FESTIVAL_TASK = {};

export class FestivalTaskQueryBuilder {
  static create(task: FestivalTaskDraft) {
    return {
      ...databaseFestivalTaskWithoutListsMapping(task),
      contacts: {
        create: task.instructions.contacts,
      },
      inChargeVolunteers: {
        create: task.instructions.inCharge.volunteers,
      },
    };
  }
}

function databaseFestivalTaskWithoutListsMapping(task: FestivalTask) {
  return {
    id: task.id,
    status: task.status,
    isDeleted: false,
    name: task.general.name,
    administratorId: task.general.administrator.id,
    teamCode: task.general.team,
    festivalActivityId: task.festivalActivity.id,
    appointmentId: task.instructions.appointment.id,
    global: task.instructions.global,
    inChargeInstruction: task.instructions.inCharge.instruction,
  };
}
