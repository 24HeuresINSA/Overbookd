import { Injectable } from "@nestjs/common";
import { PlanningTask } from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { PrismaService } from "../../../prisma.service";
import { buildVolunteerDisplayName } from "../../../utils/volunteer";
import { TaskRepository } from "../domain/planning";
import { JsonStoredTask } from "../domain/storedTask";
import { READY_TO_ASSIGN } from "@overbookd/festival-event-constants";

const SELECT_LOCATION = { id: true, name: true };
const SELECT_FESTIVAL_TASK = {
  id: true,
  name: true,
  status: true,
  appointment: { select: SELECT_LOCATION },
};
const SELECT_MOBILIZATION = {
  id: true,
  start: true,
  end: true,
  ft: {
    select: SELECT_FESTIVAL_TASK,
  },
};

const IS_NOT_DELETED = { isDeleted: false };

const SELECT_CONTACT = {
  contact: {
    select: {
      firstname: true,
      lastname: true,
      phone: true,
    },
  },
};
const SELECT_ASSIGNMENT = {
  start: true,
  end: true,
  assignees: {
    select: {
      personalData: {
        select: { id: true, firstname: true, lastname: true },
      },
    },
  },
};

type DatabaseTask = {
  id: number;
  name: string;
  appointment: { name: string };
  globalInstruction: string;
  inChargeInstruction: string;
  inChargeVolunteers: { volunteerId: number }[];
  contacts: {
    contact: { firstname: string; lastname: string; phone: string };
  }[];
  assignments: {
    start: Date;
    end: Date;
    assignees: {
      personalData: { id: number; firstname: string; lastname: string };
    }[];
  }[];
};

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getVolunteerTasksInChronologicalOrder(
    volunteerId: number,
  ): Promise<JsonStoredTask[]> {
    const tasks = await this.prisma.festivalTask.findMany({
      where: {
        assignees: { some: { userId: volunteerId } },
        ...IS_NOT_DELETED,
      },
      select: {
        id: true,
        name: true,
        appointment: { select: { name: true } },
        globalInstruction: true,
        inChargeInstruction: true,
        inChargeVolunteers: {
          select: { volunteerId: true },
          where: { volunteerId },
        },
        contacts: { select: SELECT_CONTACT },
        assignments: {
          select: SELECT_ASSIGNMENT,
          orderBy: { start: "asc" },
        },
      },
    });

    return tasks.map((task) => toTask(task, volunteerId));
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
}

function toTask(task: DatabaseTask, volunteerId: number): JsonStoredTask {
  const contacts = task.contacts.map(({ contact }) => ({
    phone: contact.phone,
    name: buildVolunteerDisplayName(contact),
  }));
  const instructions =
    task.inChargeVolunteers.length === 0
      ? task.globalInstruction
      : task.inChargeInstruction;
  const volunteerAssignment = task.assignments.find(({ assignees }) =>
    assignees.some(({ personalData }) => personalData.id === volunteerId),
  ) as IProvidePeriod;
  const assignees = task.assignments
    .flatMap(({ assignees, start, end }) => {
      return assignees.map(({ personalData }) => {
        if (personalData.id !== volunteerId) return null;
        return {
          period: { start, end },
          id: personalData.id,
          name: buildVolunteerDisplayName(personalData),
        };
      });
    })
    .filter((assignee) => assignee !== null);

  return {
    period: { start: volunteerAssignment.start, end: volunteerAssignment.end },
    id: task.id,
    name: task.name,
    location: task.appointment.name,
    instructions,
    contacts,
    assignees,
  };
}
