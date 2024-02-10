const SELECT_BASE_GEAR = {
  id: true,
  name: true,
  isConsumable: true,
  slug: true,
};

const SELECT_GEAR_STOCK = {
  inventoryRecords: {
    select: {
      quantity: true,
    },
  },
};

const SELECT_ACTIVITY_GEAR_INQUIRIES = {
  festivalActivityInquiries: {
    select: {
      quantity: true,
      fa: {
        select: {
          id: true,
          name: true,
          inquiryTimeWindows: {
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
    },
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
            select: {
              start: true,
              end: true,
            },
          },
        },
      },
    },
  },
};

export const SELECT_GEAR = {
  ...SELECT_BASE_GEAR,
  ...SELECT_GEAR_STOCK,
  ...SELECT_ACTIVITY_GEAR_INQUIRIES,
  ...SELECT_TASK_GEAR_INQUIRIES,
};
