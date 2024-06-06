import { SELECT_PERIOD } from "../../../common/query/period.query";

const SELECT_BASE_GEAR = {
  id: true,
  name: true,
  isConsumable: true,
  slug: true,
};

const SELECT_INVENTORY = {
  inventoryRecords: {
    select: {
      quantity: true,
    },
  },
};

const ACTIVE_FA = { fa: { isDeleted: false } };
const ACTIVE_FT = { ft: { isDeleted: false } };

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

export const SELECT_GEAR = {
  ...SELECT_BASE_GEAR,
  ...SELECT_INVENTORY,
  ...SELECT_ACTIVITY_GEAR_INQUIRIES,
  ...SELECT_TASK_GEAR_INQUIRIES,
  ...SELECT_BORROWS,
  ...SELECT_PURCHASES,
};
