import { PAY_CONTRIBUTION } from "@overbookd/permission";
import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";

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
  ...SELECT_USER_IDENTIFIER,
  email: true,
};
