import { Membership, STAFF, VOLUNTEER } from "@overbookd/registration";
import { PERSONNE, HARD } from "@overbookd/team-constants";
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
  nickname: true,
  availabilities: { select: SELECT_PERIOD },
  phone: true,
  birthdate: true,
  comment: true,
  note: true,
};

const IS_NOT_HARD = {
  teams: { none: { team: { code: HARD } } },
};

function buildHasMembershipApplicationCondition(membership: Membership) {
  const edition = Edition.current;
  return {
    membershipApplications: {
      some: { membership, edition, isRejected: false },
    },
  };
}

function buildHasRejectedMembershipApplicationCondition(
  membership: Membership,
) {
  const edition = Edition.current;
  return {
    membershipApplications: {
      some: { membership, edition, isRejected: true },
    },
  };
}

export const IS_ENROLLABLE_STAFF = {
  ...IS_NOT_DELETED,
  ...IS_NOT_HARD,
  ...buildHasMembershipApplicationCondition(STAFF),
};

export const IS_REJECTED_STAFF = {
  ...IS_NOT_DELETED,
  ...IS_NOT_HARD,
  ...buildHasRejectedMembershipApplicationCondition(STAFF),
};

const IS_NOT_VOLUNTEER = {
  teams: { none: { team: { code: PERSONNE } } },
};

export const IS_ENROLLABLE_VOLUNTEER = {
  ...IS_NOT_DELETED,
  ...IS_NOT_VOLUNTEER,
  ...buildHasMembershipApplicationCondition(VOLUNTEER),
};

export const IS_REJECTED_VOLUNTEER = {
  ...IS_NOT_DELETED,
  ...IS_NOT_VOLUNTEER,
  ...buildHasRejectedMembershipApplicationCondition(VOLUNTEER),
};

export type DatabaseStaffCandidate = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  teams: { team: { code: string } }[];
  membershipApplications: { candidatedAt: Date }[];
};

export type DatabaseEnrollableVolunteer = DatabaseStaffCandidate & {
  nickname: string | null;
  availabilities: IProvidePeriod[];
  phone: string;
  comment: string | null;
  birthdate: Date;
  note: string | null;
};
