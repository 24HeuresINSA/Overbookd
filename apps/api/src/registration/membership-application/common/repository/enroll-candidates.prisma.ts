import { EnrolledCandidate, STAFF, VOLUNTEER } from "@overbookd/registration";
import { StaffCandidate, VolunteerCandidate } from "@overbookd/http";
import { EnrollCandidatesRepository } from "./enroll-candidates";
import { PrismaService } from "../../../../prisma.service";
import {
  DatabaseStaffCandidate,
  DatabaseEnrollableVolunteer,
  IS_ENROLLABLE_STAFF,
  IS_ENROLLABLE_VOLUNTEER,
  IS_REJECTED_STAFF,
  SELECT_STAFF,
  SELECT_VOLUNTEER,
  IS_REJECTED_VOLUNTEER,
} from "./enroll-candidates.query";
import {
  MinimalCharismaPeriod,
  SELECT_CHARISMA_PERIOD,
} from "../../../../common/query/charisma.query";
import { Charisma } from "@overbookd/charisma";
import { Edition } from "@overbookd/time";

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
    const candidates = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: IS_ENROLLABLE_STAFF,
      select: {
        ...SELECT_STAFF,
        membershipApplications: {
          select: {
            candidatedAt: true,
          },
          where: {
            membership: STAFF,
            edition: Edition.current,
            isRejected: false,
          },
        },
      },
    });
    return candidates.map(formatToStaffCandidate);
  }

  countStaffCandidates(): Promise<number> {
    return this.prisma.user.count({ where: IS_ENROLLABLE_STAFF });
  }

  async findRejectedStaffCandidates(): Promise<StaffCandidate[]> {
    const rejectedCandidates = await this.prisma.user.findMany({
      orderBy: { id: "asc" },
      where: IS_REJECTED_STAFF,
      select: {
        ...SELECT_STAFF,
        membershipApplications: {
          select: {
            candidatedAt: true,
          },
          where: {
            membership: STAFF,
            edition: Edition.current,
            isRejected: true,
          },
        },
      },
    });
    return rejectedCandidates.map(formatToStaffCandidate);
  }

  async findVolunteerCandidates(): Promise<VolunteerCandidate[]> {
    const [volunteers, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { id: "asc" },
        where: IS_ENROLLABLE_VOLUNTEER,
        select: {
          ...SELECT_VOLUNTEER,
          membershipApplications: {
            select: {
              candidatedAt: true,
            },
            where: {
              membership: VOLUNTEER,
              edition: Edition.current,
              isRejected: false,
            },
          },
        },
      }),
      this.selectCharismaPeriods(),
    ]);
    return volunteers.map((volunteer) =>
      formatToEnrollableVolunteer(volunteer, charismaPeriods),
    );
  }

  countVolunteerCandidates(): Promise<number> {
    return this.prisma.user.count({ where: IS_ENROLLABLE_VOLUNTEER });
  }

  async findRejectedVolunteerCandidates(): Promise<VolunteerCandidate[]> {
    const [rejectedVolunteers, charismaPeriods] = await Promise.all([
      this.prisma.user.findMany({
        orderBy: { id: "asc" },
        where: IS_REJECTED_VOLUNTEER,
        select: {
          ...SELECT_VOLUNTEER,
          membershipApplications: {
            select: {
              candidatedAt: true,
            },
            where: {
              membership: VOLUNTEER,
              edition: Edition.current,
              isRejected: true,
            },
          },
        },
      }),
      this.selectCharismaPeriods(),
    ]);
    return rejectedVolunteers.map((volunteer) =>
      formatToEnrollableVolunteer(volunteer, charismaPeriods),
    );
  }

  private async selectCharismaPeriods(): Promise<MinimalCharismaPeriod[]> {
    return this.prisma.charismaPeriod.findMany({
      select: SELECT_CHARISMA_PERIOD,
    });
  }
}

function formatToEnrollableVolunteer(
  volunteer: DatabaseEnrollableVolunteer,
  charismaPeriods: MinimalCharismaPeriod[],
): VolunteerCandidate {
  const charisma = Charisma.init()
    .addAvailabilities(volunteer.availabilities, charismaPeriods)
    .calculate();
  return {
    ...formatToStaffCandidate(volunteer),
    charisma,
    availabilities: volunteer.availabilities,
    mobilePhone: volunteer.phone,
    comment: volunteer.comment === null ? undefined : volunteer.comment,
    birthdate: volunteer.birthdate,
    note: volunteer.note === null ? undefined : volunteer.note,
  };
}

function formatToStaffCandidate(staff: DatabaseStaffCandidate): StaffCandidate {
  return {
    ...staff,
    teams: staff.teams.map(({ team }) => team.code),
    candidatedAt: staff.membershipApplications[0]?.candidatedAt,
  };
}
