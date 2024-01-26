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

const SELECT_GEAR_INQUIRIES = {
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

export const SELECT_GEAR = {
  ...SELECT_BASE_GEAR,
  ...SELECT_GEAR_STOCK,
  ...SELECT_GEAR_INQUIRIES,
};
