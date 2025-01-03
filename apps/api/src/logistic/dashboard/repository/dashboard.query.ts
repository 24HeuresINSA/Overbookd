import { IS_NOT_DELETED } from "../../../common/query/not-deleted.query";
import { SELECT_PERIOD } from "../../../common/query/period.query";
import { SELECT_GEAR } from "../../common/dto/gear.query";

const SELECT_INVENTORY = {
  inventoryRecords: {
    select: {
      quantity: true,
    },
  },
};

const ACTIVE_FA = { fa: IS_NOT_DELETED };
const ACTIVE_FT = { ft: IS_NOT_DELETED };

const SELECT_ACTIVITY_GEAR_INQUIRIES = {
  festivalActivityInquiries: {
    select: {
      quantity: true,
      fa: {
        select: {
          id: true,
          name: true,
          inquiryTimeWindows: {
            select: SELECT_PERIOD,
          },
        },
      },
    },
    where: ACTIVE_FA,
  },
};

const SELECT_TASK_GEAR_INQUIRIES = {
  festivalTaskInquiries: {
    select: {
      quantity: true,
      ft: {
        select: {
          id: true,
          name: true,
          mobilizations: {
            select: SELECT_PERIOD,
          },
        },
      },
    },
    where: ACTIVE_FT,
  },
};

const SELECT_BORROWS = {
  borrows: {
    select: {
      quantity: true,
      borrow: {
        select: {
          id: true,
          lender: true,
          availableOn: true,
          unavailableOn: true,
        },
      },
    },
  },
};

const SELECT_PURCHASES = {
  purchases: {
    select: {
      quantity: true,
      purchase: {
        select: {
          id: true,
          seller: true,
          availableOn: true,
        },
      },
    },
  },
};

export const SELECT_DASHBOARD_GEAR = {
  ...SELECT_GEAR,
  ...SELECT_INVENTORY,
  ...SELECT_ACTIVITY_GEAR_INQUIRIES,
  ...SELECT_TASK_GEAR_INQUIRIES,
  ...SELECT_BORROWS,
  ...SELECT_PURCHASES,
};
