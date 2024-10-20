import { HAVE_PERSONAL_ACCOUNT } from "@overbookd/permission";
import { IS_NOT_DELETED } from "../../common/query/not-deleted.query";
import { SELECT_USER_IDENTIFIER } from "../../common/query/user.query";

export const SELECT_BASE_TRANSACTION = {
  type: true,
  amount: true,
  context: true,
  createdAt: true,
};

export const SELECT_COMPLETE_TRANSACTION = {
  id: true,
  ...IS_NOT_DELETED,
  ...SELECT_BASE_TRANSACTION,
  payor: { select: SELECT_USER_IDENTIFIER },
  payee: { select: SELECT_USER_IDENTIFIER },
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
