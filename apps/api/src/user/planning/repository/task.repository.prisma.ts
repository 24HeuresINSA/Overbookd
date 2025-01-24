import { Injectable } from "@nestjs/common";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";
import { GeoLocation } from "@overbookd/geo-location";
import { PlanningTask } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/time";
import { PrismaService } from "../../../prisma.service";
import { buildUserName } from "@overbookd/user";
import { TaskRepository } from "../domain/planning";
import { JsonStoredTask, ToPrintTask } from "../domain/storedTask";
import { JsonValue } from "@prisma/client/runtime/library";
import {
  SELECT_PERIOD,
  SELECT_PERIOD_WITH_ID,
} from "../../../common/query/period.query";
import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";

const SELECT_LOCATION = { id: true, name: true };
const SELECT_FESTIVAL_TASK = {
  id: true,
  name: true,
  status: true,
  appointment: { select: SELECT_LOCATION },
};
const SELECT_MOBILIZATION = {
  ...SELECT_PERIOD_WITH_ID,
  ft: {
    select: SELECT_FESTIVAL_TASK,
  },
};

const SELECT_CONTACT = {
  contact: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      phone: true,
    },
  },
};

type DatabaseTask = {
  id: number;
  name: string;
  appointment: { name: string; geoLocation: JsonValue | null };
  globalInstruction: string;
  inChargeInstruction: string;
  inChargeVolunteers: { volunteerId: number }[];
  contacts: {
    contact: { id: number; firstname: string; lastname: string; phone: string };
  }[];
};

type DatabaseAssignmentWithTask = IProvidePeriod & {
  festivalTask: DatabaseTask;
};

type DatabaseAssignmentWithAssignees = IProvidePeriod & {
  festivalTaskId: number;
  assignees: {
    personalData: { id: number; firstname: string; lastname: string };
  }[];
};

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    const volunteerAssignments = await this.prisma.assignment.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        festivalTask: IS_NOT_DELETED,
      },
      select: this.buildAssignmentWithTaskSelection(volunteerId),
      orderBy: { start: "asc" },
    });

    const taskIds = volunteerAssignments.map(
      ({ festivalTask }) => festivalTask.id,
    );

    const allAssignments = await this.prisma.assignment.findMany({
      where: { festivalTaskId: { in: taskIds } },
      select: this.buildAssignmentWithAssigneesSelection(volunteerId),
      orderBy: { start: "asc" },
    });

    return volunteerAssignments.map((assignment) =>
      toTask(assignment, allAssignments),
    );
  }

  async getVolunteerTasksHeIsPartOf(
    volunteerId: number,
  ): Promise<PlanningTask[]> {
    const volunteerIsPartOfMobilization = {
      volunteers: { some: { volunteerId } },
    };

    const mobilizations = await this.prisma.festivalTaskMobilization.findMany({
      where: {
        ...volunteerIsPartOfMobilization,
        ft: { ...IS_NOT_DELETED, status: { not: READY_TO_ASSIGN } },
      },
      select: SELECT_MOBILIZATION,
    });

    return mobilizations.map(({ ft, ...timeWindow }) => {
      return { ...ft, timeWindow };
    });
  }

  async getSpecificTaskInfos(taskId: number): Promise<ToPrintTask> {
    const ft = await this.prisma.festivalTask.findUnique({
      where: {
        id: taskId,
        // assignees: { some: { userId: volunteerId } },
        isDeleted: false,
      },
      select: this.buildTaskInfosSelection(),
    });

    return formatTaskToPrint(ft);
  }

  private buildTaskInfosSelection() {
    return {
      id: true,
      name: true,
      appointment: { select: { name: true, geoLocation: true } },
      globalInstruction: true,
      inChargeInstruction: true,
      inChargeVolunteers: {
        select: { volunteerId: true },
      },
      contacts: { select: SELECT_CONTACT },
    };
  }

  private buildAssignmentWithTaskSelection(volunteerId: number) {
    return {
      ...SELECT_PERIOD,
      festivalTask: {
        select: {
          id: true,
          name: true,
          appointment: { select: { name: true, geoLocation: true } },
          globalInstruction: true,
          inChargeInstruction: true,
          inChargeVolunteers: {
            select: { volunteerId: true },
            where: { volunteerId },
          },
          contacts: { select: SELECT_CONTACT },
        },
      },
    };
  }

  private buildAssignmentWithAssigneesSelection(volunteerIdToAvoid: number) {
    return {
      ...SELECT_PERIOD,
      festivalTaskId: true,
      assignees: {
        select: {
          personalData: {
            select: { id: true, firstname: true, lastname: true },
          },
        },
        where: { userId: { not: volunteerIdToAvoid } },
      },
    };
  }
}

function formatTaskToPrint(festivalTaskToPrint: DatabaseTask): ToPrintTask {
  const contacts = festivalTaskToPrint.contacts.map(({ contact }) => ({
    id: contact.id,
    phone: contact.phone,
    name: buildUserName(contact),
  }));
  const instructions =
    festivalTaskToPrint.inChargeVolunteers.length === 0
      ? `<hr>${festivalTaskToPrint.globalInstruction}`
      : `<hr>${festivalTaskToPrint.globalInstruction}<hr><h3>Instructions responsables :</h3>${festivalTaskToPrint.inChargeInstruction}`;

  // const assignees = assignments
  //   .filter(({ festivalTaskId }) => festivalTaskId === festivalTask.id)
  //   .flatMap(({ start, end, assignees }) => {
  //     return assignees.map(({ personalData }) => ({
  //       period: { start, end },
  //       id: personalData.id,
  //       name: buildUserName(personalData),
  //     }));
  //   });

  const { appointment } = festivalTaskToPrint;

  const location = {
    name: appointment.name,
    geoLocation: appointment.geoLocation as GeoLocation | null,
  };

  return {
    id: festivalTaskToPrint.id,
    name: festivalTaskToPrint.name,
    location,
    instructions,
    contacts,
    // assignees,
  };
}

function toTask(
  { start, end, festivalTask }: DatabaseAssignmentWithTask,
  assignments: DatabaseAssignmentWithAssignees[],
): JsonStoredTask {
  const contacts = festivalTask.contacts.map(({ contact }) => ({
    id: contact.id,
    phone: contact.phone,
    name: buildUserName(contact),
  }));
  const instructions =
    festivalTask.inChargeVolunteers.length === 0
      ? `<hr>${festivalTask.globalInstruction}`
      : `<hr>${festivalTask.globalInstruction}<hr><h3>Instructions responsables :</h3>${festivalTask.inChargeInstruction}`;

  const assignees = assignments
    .filter(({ festivalTaskId }) => festivalTaskId === festivalTask.id)
    .flatMap(({ start, end, assignees }) => {
      return assignees.map(({ personalData }) => ({
        period: { start, end },
        id: personalData.id,
        name: buildUserName(personalData),
      }));
    });

  const { appointment } = festivalTask;

  const location = {
    name: appointment.name,
    geoLocation: appointment.geoLocation as GeoLocation | null,
  };

  return {
    period: { start, end },
    id: festivalTask.id,
    name: festivalTask.name,
    location,
    instructions,
    contacts,
    assignees,
  };
}
