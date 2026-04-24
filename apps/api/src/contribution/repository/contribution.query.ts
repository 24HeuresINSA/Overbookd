import { PAY_CONTRIBUTION } from "@overbookd/permission";
import { SELECT_USER_WITH_TEAM_CODES } from "../../common/query/user.query";

export const WHERE_CAN_PAY_CONTRIBUTION = {
  teams: {
    some: {
      team: {
        permissions: {
          some: { permission: { name: PAY_CONTRIBUTION } },
        },
      },
    },
  },
};

export const SELECT_ADHERENT = {
  ...SELECT_USER_WITH_TEAM_CODES,
  email: true,
};
