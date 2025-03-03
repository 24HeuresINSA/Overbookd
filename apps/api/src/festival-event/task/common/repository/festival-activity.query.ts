import { FestivalTask } from "@overbookd/festival-event";
import { SELECT_LOCATION } from "../../../common/repository/location.query";
import {
  SELECT_PERIOD_WITH_ID,
  ORDER_BY_PERIOD,
} from "../../../../common/query/period.query";

export const SELECT_FESTIVAL_ACTIVITY = {
  id: true,
  name: true,
  status: true,
  generalTimeWindows: {
    select: SELECT_PERIOD_WITH_ID,
    orderBy: ORDER_BY_PERIOD,
  },
  location: {
    select: SELECT_LOCATION,
  },
  inquiryTimeWindows: {
    select: SELECT_PERIOD_WITH_ID,
    orderBy: ORDER_BY_PERIOD,
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
