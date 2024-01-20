import { FestivalTask } from "@overbookd/festival-event";

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
};

type DatabaseInquiry = {
  slug: string;
  quantity: number;
  drive?: string;
  catalogItem: { name: string };
};

export type DatabaseFestivalActivity = {
  id: FestivalTask["festivalActivity"]["id"];
  name: FestivalTask["festivalActivity"]["name"];
  status: FestivalTask["festivalActivity"]["status"];
  generalTimeWindows: FestivalTask["festivalActivity"]["timeWindows"];
  inquiryTimeWindows: FestivalTask["festivalActivity"]["inquiry"]["timeWindows"];
  inquiries: DatabaseInquiry[];
};
