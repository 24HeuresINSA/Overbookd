const SELECT_GEAR_REQUEST = {
  gear: {
    select: {
      slug: true,
      name: true,
    },
  },
  quantity: true,
};

export const SELECT_BORROW = {
  id: true,
  lender: true,
  availableOn: true,
  unavailableOn: true,
  gears: { select: SELECT_GEAR_REQUEST },
};
