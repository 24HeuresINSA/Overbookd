import { GearDetails } from "@overbookd/http";
import {
  DatabaseGear,
  DatabaseInquiry,
  InventoryRecord,
} from "./dashboard.model";

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

const inquiryFromFriday08hto09h: DatabaseInquiry = {
  quantity: 10,
  fa: {
    ...escapeGameActivity,
    inquiryTimeWindows: [friday08hto09h],
  },
};
const inquiryFromFriday09hto10h: DatabaseInquiry = {
  quantity: 20,
  fa: {
    ...pcSecuActivity,
    inquiryTimeWindows: [friday09hto10h],
  },
};
const inquiryFromFriday08hto09hAnd10hto12h: DatabaseInquiry = {
  quantity: 30,
  fa: {
    ...justeDanceActivity,
    inquiryTimeWindows: [friday08hto09h, friday10hto11h],
  },
};

const inventoryRecordWith5Quantity: InventoryRecord = {
  quantity: 5,
};
const inventoryRecordWith25Quantity: InventoryRecord = {
  quantity: 25,
};

export const gearWithNoInquiry: DatabaseGear = {
  id: 1,
  name: "gear with no inquiry",
  slug: "gear-with-no-inquiry",
  isConsumable: false,
  inquiries: [],
  inventoryRecords: [],
};
export const gearWithOneInquiry: DatabaseGear = {
  id: 2,
  name: "gear with one inquiry",
  slug: "gear-with-one-inquiry",
  isConsumable: false,
  inquiries: [inquiryFromFriday08hto09h],
  inventoryRecords: [],
};
export const gearWithTwoInquiries: DatabaseGear = {
  id: 3,
  name: "gear with two inquiries",
  slug: "gear-with-two-inquiries",
  isConsumable: false,
  inquiries: [inquiryFromFriday08hto09h, inquiryFromFriday09hto10h],
  inventoryRecords: [],
};
export const gearWithOneInquiryWithTwoTimeWindows: DatabaseGear = {
  id: 4,
  name: "gear with one inquiry with two time windows",
  slug: "gear-with-one-inquiry-with-two-time-windows",
  isConsumable: false,
  inquiries: [inquiryFromFriday08hto09hAnd10hto12h],
  inventoryRecords: [],
};
export const gearWithOneInquiryAndOneInventoryRecord: DatabaseGear = {
  id: 5,
  name: "gear with one inquiry and one inventory record",
  slug: "gear-with-one-inquiry-and-one-inventory-record",
  isConsumable: false,
  inquiries: [inquiryFromFriday08hto09h],
  inventoryRecords: [inventoryRecordWith25Quantity],
};
export const gearWithTwoInquiryAndTwoInventoryRecord: DatabaseGear = {
  id: 5,
  name: "gear with one inquiry and one inventory record",
  slug: "gear-with-one-inquiry-and-one-inventory-record",
  isConsumable: false,
  inquiries: [inquiryFromFriday08hto09h, inquiryFromFriday08hto09hAnd10hto12h],
  inventoryRecords: [
    inventoryRecordWith5Quantity,
    inventoryRecordWith25Quantity,
  ],
};

const emptyGearDetailsWithoutPeriod = {
  stock: 0,
  inquiry: 0,
  activities: [],
  inventory: 0,
};

export const gearWithNoInquiryForGraph: GearDetails[] = [
  { ...friday08hto08h15, ...emptyGearDetailsWithoutPeriod },
  { ...friday08h15to08h30, ...emptyGearDetailsWithoutPeriod },
  { ...friday08h30to08h45, ...emptyGearDetailsWithoutPeriod },
  { ...friday08h45to09h, ...emptyGearDetailsWithoutPeriod },
  { ...friday09hto09h15, ...emptyGearDetailsWithoutPeriod },
  { ...friday09h15to09h30, ...emptyGearDetailsWithoutPeriod },
];
export const gearWithOneInquiryAndOneInventoryRecordForGraph: GearDetails[] =
  [
    {
      ...friday08hto08h15,
      stock: 25,
      inquiry: 10,
      activities: [{ ...escapeGameActivity, quantity: 10 }],
      inventory: 25,
    },
    {
      ...friday08h15to08h30,
      stock: 25,
      inquiry: 10,
      activities: [{ ...escapeGameActivity, quantity: 10 }],
      inventory: 25,
    },
    {
      ...friday08h30to08h45,
      stock: 25,
      inquiry: 10,
      activities: [{ ...escapeGameActivity, quantity: 10 }],
      inventory: 25,
    },
    {
      ...friday08h45to09h,
      stock: 25,
      inquiry: 10,
      activities: [{ ...escapeGameActivity, quantity: 10 }],
      inventory: 25,
    },
    {
      ...friday09hto09h15,
      stock: 25,
      inquiry: 0,
      activities: [],
      inventory: 25,
    },
    {
      ...friday09h15to09h30,
      stock: 25,
      inquiry: 0,
      activities: [],
      inventory: 25,
    },
  ];

export const gearWithTwoInquiryAndTwoInventoryRecordForGraph: GearDetails[] =
  [
    {
      ...friday08hto08h15,
      stock: 30,
      inquiry: 40,
      activities: [
        { ...escapeGameActivity, quantity: 10 },
        { ...justeDanceActivity, quantity: 30 },
      ],
      inventory: 30,
    },
    {
      ...friday08h15to08h30,
      stock: 30,
      inquiry: 40,
      activities: [
        { ...escapeGameActivity, quantity: 10 },
        { ...justeDanceActivity, quantity: 30 },
      ],
      inventory: 30,
    },
    {
      ...friday08h30to08h45,
      stock: 30,
      inquiry: 40,
      activities: [
        { ...escapeGameActivity, quantity: 10 },
        { ...justeDanceActivity, quantity: 30 },
      ],
      inventory: 30,
    },
    {
      ...friday08h45to09h,
      stock: 30,
      inquiry: 40,
      activities: [
        { ...escapeGameActivity, quantity: 10 },
        { ...justeDanceActivity, quantity: 30 },
      ],
      inventory: 30,
    },
    {
      ...friday09hto09h15,
      stock: 30,
      inquiry: 0,
      activities: [],
      inventory: 30,
    },
    {
      ...friday09h15to09h30,
      stock: 30,
      inquiry: 0,
      activities: [],
      inventory: 30,
    },
  ];
