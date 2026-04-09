import { Charisma } from "@overbookd/charisma";
import { StaffCandidate, VolunteerCandidate } from "@overbookd/http";
import { STAFF, VOLUNTEER } from "@overbookd/registration";
import { Edition } from "@overbookd/time";
import {
  MinimalCharismaPeriod,
  SELECT_CHARISMA_PERIOD,
} from "../../../../common/query/charisma.query";
import { PrismaService } from "../../../../prisma.service";
import { EnrollCandidatesRepository } from "./enroll-candidates";
import {
  DatabaseEnrollableVolunteer,
  DatabaseStaffCandidate,
  IS_ENROLLABLE_STAFF,
  IS_ENROLLABLE_VOLUNTEER,
  IS_REJECTED_STAFF,
  IS_REJECTED_VOLUNTEER,
  SELECT_STAFF,
  SELECT_VOLUNTEER,
} from "./enroll-candidates.query";

export class PrismaEnrollCandidates implements EnrollCandidatesRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async hasStaffApplication(email: string): Promise<boolean> {
    const application = await this.prisma.membershipApplication.findFirst({
      where: {
        user: { email },
        membership: STAFF,
        edition: Edition.current,
      },
    });
    return application !== null;
  }

  async hasVolunteerApplication(email: string): Promise<boolean> {
    const application = await this.prisma.membershipApplication.findFirst({
      where: {
        user: { email },
        membership: VOLUNTEER,
        edition: Edition.current,
      },
    });
    return application !== null;
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
    nickname: volunteer.nickname,
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
    candidatedAt: staff.membershipApplications.at(0).candidatedAt,
  };
}
