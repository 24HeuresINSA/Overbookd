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
const SELECT_ASSIGNMENT_WITH_ASSIGNEES = {
  start: true,
  end: true,
  assignees: {
    select: {
      personalData: {
        select: { id: true, firstname: true, lastname: true },
      },
    },
  },
  festivalTaskId: true,
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
    });

    const taskIds = volunteerAssignments.map(
      ({ festivalTask }) => festivalTask.id,
    );

    const allAssignments = await this.prisma.assignment.findMany({
      where: { festivalTaskId: { in: taskIds } },
      select: SELECT_ASSIGNMENT_WITH_ASSIGNEES,
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

  private buildAssignmentWithTaskSelection(volunteerId: number) {
    return {
      start: true,
      end: true,
      festivalTask: {
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
        },
      },
    };
  }
}

function toTask(
  { start, end, festivalTask }: DatabaseAssignmentWithTask,
  assignments: DatabaseAssignmentWithAssignees[],
): JsonStoredTask {
  const contacts = festivalTask.contacts.map(({ contact }) => ({
    phone: contact.phone,
    name: buildVolunteerDisplayName(contact),
  }));
  const instructions =
    festivalTask.inChargeVolunteers.length === 0
      ? festivalTask.globalInstruction
      : `${festivalTask.globalInstruction}<br/>${festivalTask.inChargeInstruction}`;

  const assignees = assignments
    .filter(({ festivalTaskId }) => festivalTaskId === festivalTask.id)
    .flatMap(({ start, end, assignees }) => {
      return assignees.map(({ personalData }) => ({
        period: { start, end },
        id: personalData.id,
        name: buildVolunteerDisplayName(personalData),
      }));
    });

  return {
    period: { start, end },
    id: festivalTask.id,
    name: festivalTask.name,
    location: festivalTask.appointment.name,
    instructions,
    contacts,
    assignees,
  };
}
