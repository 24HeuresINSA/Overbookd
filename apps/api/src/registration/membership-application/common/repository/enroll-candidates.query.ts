import { Membership, STAFF, VOLUNTEER } from "@overbookd/registration";
import { BENEVOLE_CODE, HARD_CODE } from "@overbookd/team-constants";
import { Edition, IProvidePeriod } from "@overbookd/time";
import { SELECT_PERIOD } from "../../../../common/query/period.query";
import { SELECT_USER_TEAMS } from "../../../../user/user.query";
import { IS_NOT_DELETED } from "../../../../common/query/not-deleted.query";

export const SELECT_STAFF = {
  id: true,
  firstname: true,
  lastname: true,
  email: true,
  ...SELECT_USER_TEAMS,
};

export const SELECT_VOLUNTEER = {
  ...SELECT_STAFF,
  charisma: true,
  availabilities: { select: SELECT_PERIOD },
  phone: true,
  createdAt: true,
  birthdate: true,
  comment: true,
  note: true,
};

const IS_NOT_HARD = {
  teams: { none: { team: { code: HARD_CODE } } },
};

function buildHasMembershipApplicationCondition(membership: Membership) {
  const edition = Edition.current;
  return {
    membershipApplications: {
      some: { membership, edition, isRejected: false },
    },
  };
}

export const IS_ENROLLABLE_STAFF = {
  ...IS_NOT_DELETED,
  ...IS_NOT_HARD,
  ...buildHasMembershipApplicationCondition(STAFF),
};

const IS_NOT_VOLUNTEER = {
  teams: { none: { team: { code: BENEVOLE_CODE } } },
};

export const IS_ENROLLABLE_VOLUNTEER = {
  ...IS_NOT_DELETED,
  ...IS_NOT_VOLUNTEER,
  ...IS_NOT_HARD,
  ...buildHasMembershipApplicationCondition(VOLUNTEER),
};

export type DatabaseEnrollableStaff = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  teams: { team: { code: string } }[];
};

export type DatabaseEnrollableVolunteer = DatabaseEnrollableStaff & {
  availabilities: IProvidePeriod[];
  charisma: number;
  phone: string;
  comment: string | null;
  birthdate: Date;
  createdAt: Date;
  note: string | null;
};
