import { PAY_CONTRIBUTION } from "@overbookd/permission";

export const SELECT_CONTRIBUTION = {
  amount: true,
  paymentDate: true,
};

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
