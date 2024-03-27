import { ConsumableGearDetails, GearDetails } from "@overbookd/http";
import {
  DatabaseGear,
  DatabaseActivityInquiry,
  InventoryRecord,
  DatabaseTaskInquiry,
  DatabaseBorrow,
} from "./dashboard.model";
import { GearBorrow } from "@overbookd/http/src/logistic/dashboard.model";

const friday08hto09h = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
};
const friday09hto10h = {
  start: new Date("2024-05-17T09:00+02:00"),
  end: new Date("2024-05-17T10:00+02:00"),
};
const friday10hto11h = {
  start: new Date("2024-05-17T10:00+02:00"),
  end: new Date("2024-05-17T11:00+02:00"),
};
export const friday08hto09h30 = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T09:30+02:00"),
};
const friday08hto08h30 = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T08:30+02:00"),
};
const friday08hto08h15 = {
  start: new Date("2024-05-17T08:00+02:00"),
  end: new Date("2024-05-17T08:15+02:00"),
};
const friday08h15to08h30 = {
  start: new Date("2024-05-17T08:15+02:00"),
  end: new Date("2024-05-17T08:30+02:00"),
};
const friday08h30to08h45 = {
  start: new Date("2024-05-17T08:30+02:00"),
  end: new Date("2024-05-17T08:45+02:00"),
};
const friday08h45to09h = {
  start: new Date("2024-05-17T08:45+02:00"),
  end: new Date("2024-05-17T09:00+02:00"),
};
const friday09hto09h15 = {
  start: new Date("2024-05-17T09:00+02:00"),
  end: new Date("2024-05-17T09:15+02:00"),
};
const friday09h15to09h30 = {
  start: new Date("2024-05-17T09:15+02:00"),
  end: new Date("2024-05-17T09:30+02:00"),
};

const escapeGameActivity = {
  id: 1,
  name: "Escape Game",
};
const pcSecuActivity = {
  id: 2,
  name: "PC Secu",
};
const justeDanceActivity = {
  id: 3,
  name: "Juste Dance",
};

const installEscapeGameTask = {
  id: 1,
  name: "Install Escape Game",
};

const activityInquiryFromFriday08hto09h: DatabaseActivityInquiry = {
  quantity: 10,
  fa: {
    ...escapeGameActivity,
    inquiryTimeWindows: [friday08hto09h],
  },
};
const activityInquiryFromFriday09hto10h: DatabaseActivityInquiry = {
  quantity: 20,
  fa: {
    ...pcSecuActivity,
    inquiryTimeWindows: [friday09hto10h],
  },
};
const activityInquiryFromFriday08hto09hAnd10hto12h: DatabaseActivityInquiry = {
  quantity: 30,
  fa: {
    ...justeDanceActivity,
    inquiryTimeWindows: [friday08hto09h, friday10hto11h],
  },
};
const activityInquiryFromFriday08hto08h30And09hto09h15: DatabaseActivityInquiry =
  {
    quantity: 30,
    fa: {
      ...justeDanceActivity,
      inquiryTimeWindows: [friday08hto08h30, friday09hto09h15],
    },
  };
const taskInquiryFromFriday08hto09h: DatabaseTaskInquiry = {
  quantity: 25,
  ft: {
    ...installEscapeGameTask,
    mobilizations: [friday08hto09h],
  },
};

const inventoryRecordWith5Quantity: InventoryRecord = {
  quantity: 5,
};
const inventoryRecordWith25Quantity: InventoryRecord = {
  quantity: 25,
};

const databaseBorrowFromFriday08hto09h: DatabaseBorrow = {
  quantity: 5,
  borrow: {
    id: 1,
    lender: "KARNA",
    availableOn: friday08hto09h.start,
    unavailableOn: friday08hto09h.end,
  },
};

export const gearWithNoInquiry: DatabaseGear = {
  id: 1,
  name: "gear with no inquiry",
  slug: "gear-with-no-inquiry",
  isConsumable: false,
  festivalActivityInquiries: [],
  festivalTaskInquiries: [],
  inventoryRecords: [],
  borrows: [],
};
export const gearWithOneInquiry: DatabaseGear = {
  id: 2,
  name: "gear with one inquiry",
  slug: "gear-with-one-inquiry",
  isConsumable: false,
  festivalActivityInquiries: [activityInquiryFromFriday08hto09h],
  festivalTaskInquiries: [],
  inventoryRecords: [],
  borrows: [],
};
export const gearWithTwoInquiries: DatabaseGear = {
  id: 3,
  name: "gear with two inquiries",
  slug: "gear-with-two-inquiries",
  isConsumable: false,
  festivalActivityInquiries: [activityInquiryFromFriday09hto10h],
  festivalTaskInquiries: [taskInquiryFromFriday08hto09h],
  inventoryRecords: [],
  borrows: [],
};
export const gearWithOneInquiryWithTwoTimeWindows: DatabaseGear = {
  id: 4,
  name: "gear with one inquiry with two time windows",
  slug: "gear-with-one-inquiry-with-two-time-windows",
  isConsumable: false,
  festivalActivityInquiries: [activityInquiryFromFriday08hto09hAnd10hto12h],
  festivalTaskInquiries: [],
  inventoryRecords: [],
  borrows: [],
};
export const gearWithOneInquiryAndOneInventoryRecord: DatabaseGear = {
  id: 5,
  name: "gear with one inquiry and one inventory record",
  slug: "gear-with-one-inquiry-and-one-inventory-record",
  isConsumable: false,
  festivalActivityInquiries: [activityInquiryFromFriday08hto09h],
  festivalTaskInquiries: [],
  inventoryRecords: [inventoryRecordWith25Quantity],
  borrows: [],
};
export const gearWithTwoInquiryAndTwoInventoryRecord: DatabaseGear = {
  id: 6,
  name: "gear with one inquiry and one inventory record",
  slug: "gear-with-one-inquiry-and-one-inventory-record",
  isConsumable: false,
  festivalActivityInquiries: [activityInquiryFromFriday08hto09hAnd10hto12h],
  festivalTaskInquiries: [taskInquiryFromFriday08hto09h],
  inventoryRecords: [
    inventoryRecordWith5Quantity,
    inventoryRecordWith25Quantity,
  ],
  borrows: [],
};
export const consumableGearWithOneInquiry: DatabaseGear = {
  id: 7,
  name: "consumable gear with one inquiry",
  slug: "consumable-gear-with-one-inquiry",
  isConsumable: true,
  festivalActivityInquiries: [activityInquiryFromFriday08hto09h],
  festivalTaskInquiries: [],
  inventoryRecords: [],
  borrows: [],
};
export const consumableGearWithTwoInquiriesAndOneInventoryRecord: DatabaseGear =
  {
    id: 8,
    name: "consumable gear with two inquiries and one inventory record",
    slug: "consumable-gear-with-two-inquiries-and-one-inventory-record",
    isConsumable: true,
    festivalActivityInquiries: [activityInquiryFromFriday09hto10h],
    festivalTaskInquiries: [taskInquiryFromFriday08hto09h],
    inventoryRecords: [inventoryRecordWith5Quantity],
    borrows: [],
  };
export const consumableGearWithOneInquiryWithTwoSameActivityTimeWindows: DatabaseGear =
  {
    id: 9,
    name: "consumable gear with one inquiry with two same activity time windows",
    slug: "consumable-gear-with-one-inquiry-with-two-same-activity-time-windows",
    isConsumable: true,
    festivalActivityInquiries: [
      activityInquiryFromFriday08hto08h30And09hto09h15,
    ],
    festivalTaskInquiries: [],
    inventoryRecords: [],
    borrows: [],
  };
export const gearWithOneInventoryRecord: DatabaseGear = {
  id: 10,
  name: "gear with one inventory record",
  slug: "gear-with-one-inventory-record",
  isConsumable: false,
  festivalActivityInquiries: [],
  festivalTaskInquiries: [],
  inventoryRecords: [inventoryRecordWith25Quantity],
  borrows: [],
};
export const gearWithOneInventoryRecordAndOneBorrow: DatabaseGear = {
  id: 11,
  name: "gear with one inventory record and one borrow",
  slug: "gear-with-one-inventory-record-and-one-borrow",
  isConsumable: false,
  festivalActivityInquiries: [],
  festivalTaskInquiries: [],
  inventoryRecords: [inventoryRecordWith25Quantity],
  borrows: [databaseBorrowFromFriday08hto09h],
};
export const gearWithOneInquiryAndOneBorrow: DatabaseGear = {
  id: 12,
  name: "gear with one inquiry and one borrow",
  slug: "gear-with-one-inquiry-and-one-borrow",
  isConsumable: false,
  festivalActivityInquiries: [activityInquiryFromFriday08hto09h],
  festivalTaskInquiries: [],
  inventoryRecords: [],
  borrows: [databaseBorrowFromFriday08hto09h],
};
export const consumableGearWithOneInquiryAndOneBorrow: DatabaseGear = {
  id: 13,
  name: "consumable gear with one inquiry and one borrow",
  slug: "consumable-gear-with-one-inquiry-and-one-borrow",
  isConsumable: true,
  festivalActivityInquiries: [activityInquiryFromFriday09hto10h],
  festivalTaskInquiries: [],
  inventoryRecords: [],
  borrows: [databaseBorrowFromFriday08hto09h],
};

const emptyGearDetails = {
  stock: 0,
  inquiry: 0,
  activities: [],
  tasks: [],
  inventory: 0,
  borrows: [],
};

const emptyConsumableDetails = { ...emptyGearDetails, consumed: 0 };

export const gearWithNoInquiryForGraph: GearDetails[] = [
  { ...friday08hto08h15, ...emptyGearDetails },
  { ...friday08h15to08h30, ...emptyGearDetails },
  { ...friday08h30to08h45, ...emptyGearDetails },
  { ...friday08h45to09h, ...emptyGearDetails },
  { ...friday09hto09h15, ...emptyGearDetails },
  { ...friday09h15to09h30, ...emptyGearDetails },
];
export const gearWithOneInquiryAndOneInventoryRecordForGraph: GearDetails[] = [
  {
    ...emptyGearDetails,
    ...friday08hto08h15,
    stock: 25,
    inquiry: 10,
    activities: [{ ...escapeGameActivity, quantity: 10 }],
    inventory: 25,
  },
  {
    ...emptyGearDetails,
    ...friday08h15to08h30,
    stock: 25,
    inquiry: 10,
    activities: [{ ...escapeGameActivity, quantity: 10 }],
    inventory: 25,
  },
  {
    ...emptyGearDetails,
    ...friday08h30to08h45,
    stock: 25,
    inquiry: 10,
    activities: [{ ...escapeGameActivity, quantity: 10 }],
    inventory: 25,
  },
  {
    ...emptyGearDetails,
    ...friday08h45to09h,
    stock: 25,
    inquiry: 10,
    activities: [{ ...escapeGameActivity, quantity: 10 }],
    inventory: 25,
  },
  {
    ...emptyGearDetails,
    ...friday09hto09h15,
    stock: 25,
    inventory: 25,
  },
  {
    ...emptyGearDetails,
    ...friday09h15to09h30,
    stock: 25,
    inventory: 25,
  },
];

export const consumableGearWithOneInquiryForGraph: ConsumableGearDetails[] = [
  {
    ...emptyConsumableDetails,
    ...friday08hto08h15,
    inquiry: 10,
    activities: [{ ...escapeGameActivity, quantity: 10 }],
  },
  {
    ...emptyConsumableDetails,
    ...friday08h15to08h30,
    stock: -10,
    consumed: 10,
  },
  {
    ...emptyConsumableDetails,
    ...friday08h30to08h45,
    stock: -10,
    consumed: 10,
  },
  {
    ...emptyConsumableDetails,
    ...friday08h45to09h,
    stock: -10,
    consumed: 10,
  },
  {
    ...emptyConsumableDetails,
    ...friday09hto09h15,
    stock: -10,
    consumed: 10,
  },
  {
    ...emptyConsumableDetails,
    ...friday09h15to09h30,
    stock: -10,
    consumed: 10,
  },
];

export const consumableGearWithTwoInquiriesAndOneInventoryRecordForGraph: ConsumableGearDetails[] =
  [
    {
      ...emptyConsumableDetails,
      ...friday08hto08h15,
      stock: 5,
      inquiry: 25,
      tasks: [{ ...installEscapeGameTask, quantity: 25 }],
      inventory: 5,
    },
    {
      ...emptyConsumableDetails,
      ...friday08h15to08h30,
      stock: -20,
      inventory: 5,
      consumed: 25,
    },
    {
      ...emptyConsumableDetails,
      ...friday08h30to08h45,
      stock: -20,
      inventory: 5,
      consumed: 25,
    },
    {
      ...emptyConsumableDetails,
      ...friday08h45to09h,
      stock: -20,
      inventory: 5,
      consumed: 25,
    },
    {
      ...emptyConsumableDetails,
      ...friday09hto09h15,
      stock: -20,
      inquiry: 20,
      activities: [{ ...pcSecuActivity, quantity: 20 }],
      inventory: 5,
      consumed: 25,
    },
    {
      ...emptyConsumableDetails,
      ...friday09h15to09h30,
      stock: -40,
      inventory: 5,
      consumed: 45,
    },
  ];
export const consumableGearWithOneInquiryWithTwoSameActivityTimeWindowsForGraph: ConsumableGearDetails[] =
  [
    {
      ...emptyConsumableDetails,
      ...friday08hto08h15,
      inquiry: 30,
      activities: [{ ...justeDanceActivity, quantity: 30 }],
    },
    {
      ...emptyConsumableDetails,
      ...friday08h15to08h30,
      stock: -30,
      consumed: 30,
    },
    {
      ...emptyConsumableDetails,
      ...friday08h30to08h45,
      stock: -30,
      consumed: 30,
    },
    {
      ...emptyConsumableDetails,
      ...friday08h45to09h,
      stock: -30,
      consumed: 30,
    },
    {
      ...emptyConsumableDetails,
      ...friday09hto09h15,
      stock: -30,
      inquiry: 30,
      activities: [{ ...justeDanceActivity, quantity: 30 }],
      consumed: 30,
    },
    {
      ...emptyConsumableDetails,
      ...friday09h15to09h30,
      stock: -60,
      consumed: 60,
    },
  ];

export const gearWithTwoInquiriesAndTwoInventoryRecordsForGraph: GearDetails[] =
  [
    {
      ...emptyGearDetails,
      ...friday08hto08h15,
      stock: 30,
      inquiry: 55,
      activities: [{ ...justeDanceActivity, quantity: 30 }],
      tasks: [{ ...installEscapeGameTask, quantity: 25 }],
      inventory: 30,
    },
    {
      ...emptyGearDetails,
      ...friday08h15to08h30,
      stock: 30,
      inquiry: 55,
      activities: [{ ...justeDanceActivity, quantity: 30 }],
      tasks: [{ ...installEscapeGameTask, quantity: 25 }],
      inventory: 30,
    },
    {
      ...emptyGearDetails,
      ...friday08h30to08h45,
      stock: 30,
      inquiry: 55,
      activities: [{ ...justeDanceActivity, quantity: 30 }],
      tasks: [{ ...installEscapeGameTask, quantity: 25 }],
      inventory: 30,
    },
    {
      ...emptyGearDetails,
      ...friday08h45to09h,
      stock: 30,
      inquiry: 55,
      activities: [{ ...justeDanceActivity, quantity: 30 }],
      tasks: [{ ...installEscapeGameTask, quantity: 25 }],
      inventory: 30,
    },
    {
      ...emptyGearDetails,
      ...friday09hto09h15,
      stock: 30,
      inventory: 30,
    },
    {
      ...emptyGearDetails,
      ...friday09h15to09h30,
      stock: 30,
      inventory: 30,
    },
  ];

const borrowFromFriday08hto09h: GearBorrow = {
  id: databaseBorrowFromFriday08hto09h.borrow.id,
  lender: databaseBorrowFromFriday08hto09h.borrow.lender,
  start: databaseBorrowFromFriday08hto09h.borrow.availableOn,
  end: databaseBorrowFromFriday08hto09h.borrow.unavailableOn,
  quantity: databaseBorrowFromFriday08hto09h.quantity,
};

export const gearWithOneInventoryRecordAndOneBorrowForGraph: GearDetails[] = [
  {
    ...emptyGearDetails,
    ...friday08hto08h15,
    stock: 30,
    inventory: 25,
    borrows: [borrowFromFriday08hto09h],
  },
  {
    ...emptyGearDetails,
    ...friday08h15to08h30,
    stock: 30,
    inventory: 25,
    borrows: [borrowFromFriday08hto09h],
  },
  {
    ...emptyGearDetails,
    ...friday08h30to08h45,
    stock: 30,
    inventory: 25,
    borrows: [borrowFromFriday08hto09h],
  },
  {
    ...emptyGearDetails,
    ...friday08h45to09h,
    stock: 30,
    inventory: 25,
    borrows: [borrowFromFriday08hto09h],
  },
  {
    ...emptyGearDetails,
    ...friday09hto09h15,
    stock: 25,
    inventory: 25,
  },
  {
    ...emptyGearDetails,
    ...friday09h15to09h30,
    stock: 25,
    inventory: 25,
  },
];

export const consumableGearWithOneInquiryAndOneBorrowForGraph: GearDetails[] = [
  {
    ...emptyConsumableDetails,
    ...friday08hto08h15,
    stock: 5,
    borrows: [borrowFromFriday08hto09h],
  },
  {
    ...emptyConsumableDetails,
    ...friday08h15to08h30,
    stock: 5,
  },
  {
    ...emptyConsumableDetails,
    ...friday08h30to08h45,
    stock: 5,
  },
  {
    ...emptyConsumableDetails,
    ...friday08h45to09h,
    stock: 5,
  },
  {
    ...emptyConsumableDetails,
    ...friday09hto09h15,
    stock: 5,
    inquiry: 20,
    activities: [{ ...pcSecuActivity, quantity: 20 }],
  },
  {
    ...emptyConsumableDetails,
    ...friday09h15to09h30,
    stock: -15,
    consumed: 20,
  },
];
