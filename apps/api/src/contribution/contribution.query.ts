import { PAY_CONTRIBUTION } from "@overbookd/permission";

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
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};
