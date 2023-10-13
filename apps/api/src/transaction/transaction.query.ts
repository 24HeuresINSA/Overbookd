import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";
import { SELECT_USERNAME_WITH_ID } from "../user/user.query";

export const SELECT_TRANSACTION = {
  id: true,
  type: true,
  payor: {
    select: SELECT_USERNAME_WITH_ID,
  },
  payee: {
    select: SELECT_USERNAME_WITH_ID,
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
