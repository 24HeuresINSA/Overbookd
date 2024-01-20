import { FestivalTask, FestivalTaskDraft } from "@overbookd/festival-event";
import { SELECT_ADHERENT } from "./adherent/adherent.query";
import { SELECT_LOCATION } from "./location.query";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity/festival-activity.query";

export const SELECT_FESTIVAL_TASK = {
  id: true,
  status: true,
  name: true,
  teamCode: true,
  administrator: {
    select: SELECT_ADHERENT,
  },
  appointment: {
    select: SELECT_LOCATION,
  },
  festivalActivity: {
    select: SELECT_FESTIVAL_ACTIVITY,
  },
  contacts: {
    select: {
      contact: {
        select: SELECT_ADHERENT,
      },
    },
  },
  globalInstruction: true,
  inChargeInstruction: true,
  inChargeVolunteers: {
    select: {
      volunteer: {
        select: SELECT_ADHERENT,
      },
    },
  },
};

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
    globalInstruction: task.instructions.global,
    inChargeInstruction: task.instructions.inCharge.instruction,
  };
}

export const IS_NOT_DELETED = { isDeleted: false };

export function buildFestivalTaskCondition(id: FestivalTask["id"]) {
  return {
    id,
    ...IS_NOT_DELETED,
  };
}
