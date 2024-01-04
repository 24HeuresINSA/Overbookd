const SELECT_BASE_GEAR_PREVIEW = {
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
  inquiries: {
    select: {
      quantity: true,
      fa: {
        select: {
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

export const SELECT_GEAR_PREVIEW = {
  ...SELECT_BASE_GEAR_PREVIEW,
  ...SELECT_GEAR_STOCK,
  ...SELECT_GEAR_INQUIRIES,
};
