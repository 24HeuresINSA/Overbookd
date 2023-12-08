import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";

export const SELECT_TRANSACTION_USER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export const SELECT_TRANSACTION = {
  id: true,
  type: true,
  payor: {
    select: SELECT_TRANSACTION_USER,
  },
  payee: {
    select: SELECT_TRANSACTION_USER,
  },
  amount: true,
  context: true,
  createdAt: true,
  isDeleted: true,
};

export const CAN_HAVE_PERSONAL_ACCOUNT = {
  teams: {
    some: {
      team: {
        permissions: {
          some: {
            permissionName: HAVE_PERSONAL_ACCOUNT,
          },
        },
      },
    },
  },
};
