import { EnrolledCandidate } from "@overbookd/registration";
import { StaffCandidate, VolunteerCandidate } from "@overbookd/http";
import { EnrollCandidatesRepository } from "./enroll-candidates";
import { PrismaService } from "../../../../prisma.service";
import {
  DatabaseEnrollableStaff,
  DatabaseEnrollableVolunteer,
  IS_ENROLLABLE_STAFF,
  IS_ENROLLABLE_VOLUNTEER,
  SELECT_STAFF,
  SELECT_VOLUNTEER,
} from "./enroll-candidates.query";

export class PrismaEnrollCandidates implements EnrollCandidatesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async enroll(newcomers: EnrolledCandidate[]) {
    const allRequests = newcomers.map(({ id, teams }) =>
      this.prisma.user.update({
        where: { id },
        data: {
          teams: {
            upsert: teams.map((team) => ({
              where: { userId_teamCode: { userId: id, teamCode: team } },
              create: { teamCode: team },
              update: {},
            })),
          },
        },
      }),
    );
    await this.prisma.$transaction(allRequests);
  }

  async findStaffCandidates(): Promise<StaffCandidate[]> {
    const staffs = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: IS_ENROLLABLE_STAFF,
      select: SELECT_STAFF,
    });
    return staffs.map(formatToEnrollableStaff);
  }

  countStaffCandidates(): Promise<number> {
    return this.prisma.user.count({ where: IS_ENROLLABLE_STAFF });
  }

  async findVolunteerCandidates(): Promise<VolunteerCandidate[]> {
    const volunteers = await this.prisma.user.findMany({
      orderBy: { id: "desc" },
      where: IS_ENROLLABLE_VOLUNTEER,
      select: SELECT_VOLUNTEER,
    });
    return volunteers.map(formatToEnrollableVolunteer);
  }

  async findVolunteerCandidate(
    volunteerId: number,
  ): Promise<VolunteerCandidate | null> {
    const volunteer = await this.prisma.user.findFirst({
      where: { id: volunteerId, ...IS_ENROLLABLE_VOLUNTEER },
      select: SELECT_VOLUNTEER,
    });
    if (!volunteer) return null;
    return formatToEnrollableVolunteer(volunteer);
  }
}

function formatToEnrollableVolunteer(
  volunteer: DatabaseEnrollableVolunteer,
): VolunteerCandidate {
  return {
    ...formatToEnrollableStaff(volunteer),
    charisma: volunteer.charisma,
    availabilities: volunteer.availabilities,
    mobilePhone: volunteer.phone,
    registeredAt: volunteer.createdAt,
    comment: volunteer.comment === null ? undefined : volunteer.comment,
    birthdate: volunteer.birthdate,
    note: volunteer.note === null ? undefined : volunteer.note,
  };
}

function formatToEnrollableStaff(
  staff: DatabaseEnrollableStaff,
): StaffCandidate {
  return {
    ...staff,
    teams: staff.teams.map(({ team }) => team.code),
  };
}
