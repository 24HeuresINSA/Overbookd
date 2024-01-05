import { InventoryRecord } from "@overbookd/http";
import { DatabaseGear, DatabaseInquiry } from "./summary-gear.model";

const friday08hto09h = {
  start: new Date("2023-05-19T08:00+02:00"),
  end: new Date("2023-05-19T09:00+02:00"),
};
const friday09hto10h = {
  start: new Date("2023-05-19T09:00+02:00"),
  end: new Date("2023-05-19T10:00+02:00"),
};
const friday10hto11h = {
  start: new Date("2023-05-19T10:00+02:00"),
  end: new Date("2023-05-19T11:00+02:00"),
};

const inquiryFromFriday08hto09h: DatabaseInquiry = {
  quantity: 10,
  fa: {
    inquiryTimeWindows: [friday08hto09h],
  },
};
const inquiryFromFriday09hto10h: DatabaseInquiry = {
  quantity: 20,
  fa: {
    inquiryTimeWindows: [friday09hto10h],
  },
};
const inquiryFromFriday08hto09hAnd10hto12h: DatabaseInquiry = {
  quantity: 30,
  fa: {
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
