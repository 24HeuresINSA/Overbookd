import {
  Adherent,
  Contact,
  FestivalTask,
  FestivalTaskDraft,
  KeyEvent,
  Volunteer,
} from "@overbookd/festival-event";
import { SELECT_ADHERENT, SELECT_CONTACT } from "./adherent/adherent.query";
import { SELECT_LOCATION } from "./location/location.query";
import { SELECT_FESTIVAL_ACTIVITY } from "./festival-activity/festival-activity.query";
import { Prisma } from "@prisma/client";

export const SELECT_FESTIVAL_TASK = {
  id: true,
  status: true,
  name: true,
  teamCode: true,
  administrator: { select: SELECT_ADHERENT },
  appointment: { select: SELECT_LOCATION },
  festivalActivity: { select: SELECT_FESTIVAL_ACTIVITY },
  contacts: { select: { contact: { select: SELECT_CONTACT } } },
  globalInstruction: true,
  inChargeInstruction: true,
  inChargeVolunteers: { select: { volunteer: { select: SELECT_ADHERENT } } },
};

export class FestivalTaskQueryBuilder {
  static create(task: FestivalTaskDraft) {
    return {
      ...databaseFestivalTaskWithoutListsMapping(task),
      contacts: {
        create: task.instructions.contacts.map((contact) => ({
          contact: { connect: { id: contact.id } },
        })),
      },
      inChargeVolunteers: {
        create: task.instructions.inCharge.volunteers.map((volunteer) => ({
          volunteer: { connect: { id: volunteer.id } },
        })),
      },
      events: {
        create: task.history.map(keyEventToHistory(task)),
      },
    };
  }

  static update(task: FestivalTask) {
    const contacts = this.upsertContacts(task.id, task.instructions.contacts);
    const inChargeVolunteers = this.upsertInChargeVolunteers(
      task.id,
      task.instructions.inCharge.volunteers,
    );
    return {
      ...databaseFestivalTaskWithoutListsMapping(task),
      contacts,
      inChargeVolunteers,
    };
  }

  private static upsertContacts(
    festivalTaskId: FestivalTask["id"],
    contacts: Contact[],
  ) {
    return {
      upsert: contacts.map((contact) => ({
        where: {
          contactId_festivalTaskId: {
            contactId: contact.id,
            festivalTaskId,
          },
        },
        create: { contact: { connect: { id: contact.id } } },
        update: { contact: { connect: { id: contact.id } } },
      })),
      deleteMany: {
        festivalTaskId,
        contactId: { notIn: contacts.map(({ id }) => id) },
      },
    };
  }

  private static upsertInChargeVolunteers(
    festivalTaskId: FestivalTask["id"],
    volunteers: Volunteer[],
  ) {
    return {
      upsert: volunteers.map((volunteer) => ({
        where: {
          volunteerId_festivalTaskId: {
            volunteerId: volunteer.id,
            festivalTaskId,
          },
        },
        create: { volunteer: { connect: { id: volunteer.id } } },
        update: { volunteer: { connect: { id: volunteer.id } } },
      })),
      deleteMany: {
        festivalTaskId,
        volunteerId: { notIn: volunteers.map(({ id }) => id) },
      },
    };
  }
}

type StoredHistoryKeyEvent = {
  event: KeyEvent["action"];
  instigatorId: Adherent["id"];
  at: Date;
  context: KeyEvent["description"];
  snapshot: Prisma.JsonObject;
};

function keyEventToHistory(
  task: FestivalTask,
): (event: KeyEvent) => StoredHistoryKeyEvent {
  return ({ action, by, at, description }) => ({
    event: action,
    instigatorId: by.id,
    at,
    context: description,
    snapshot: task as unknown as Prisma.JsonObject,
  });
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
    appointmentId: task.instructions.appointment?.id,
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
