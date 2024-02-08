import { FestivalTask } from "@overbookd/festival-event";
import { SELECT_LOCATION } from "../location/location.query";

const SELECT_TIME_WINDOW = {
  id: true,
  start: true,
  end: true,
};

export const SELECT_FESTIVAL_ACTIVITY = {
  id: true,
  name: true,
  status: true,
  generalTimeWindows: {
    select: SELECT_TIME_WINDOW,
  },
  location: {
    select: SELECT_LOCATION,
  },
  inquiryTimeWindows: {
    select: SELECT_TIME_WINDOW,
  },
  inquiries: {
    select: {
      slug: true,
      quantity: true,
      drive: true,
      catalogItem: {
        select: {
          name: true,
        },
      },
    },
  },
  water: true,
  electricity: {
    select: { id: true },
  },
};

type DatabaseInquiry = {
  slug: string;
  quantity: number;
  drive?: string;
  catalogItem: { name: string };
};

type DatabaseElectricitySupply = {
  id: string;
};

export type DatabaseFestivalActivity = {
  id: FestivalTask["festivalActivity"]["id"];
  name: FestivalTask["festivalActivity"]["name"];
  status: FestivalTask["festivalActivity"]["status"];
  location: FestivalTask["festivalActivity"]["location"];
  generalTimeWindows: FestivalTask["festivalActivity"]["timeWindows"];
  inquiryTimeWindows: FestivalTask["festivalActivity"]["inquiry"]["timeWindows"];
  water: string | null;
  electricity?: DatabaseElectricitySupply[];
  inquiries: DatabaseInquiry[];
};
