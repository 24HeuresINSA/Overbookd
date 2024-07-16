import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";

export const SELECT_TRANSACTION_USER = {
  id: true,
  firstname: true,
  lastname: true,
  nickname: true,
};

export const SELECT_BASE_TRANSACTION = {
  type: true,
  amount: true,
  context: true,
  createdAt: true,
};

export const SELECT_COMPLETE_TRANSACTION = {
  id: true,
  isDeleted: true,
  ...SELECT_BASE_TRANSACTION,
  payor: { select: SELECT_TRANSACTION_USER },
  payee: { select: SELECT_TRANSACTION_USER },
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
