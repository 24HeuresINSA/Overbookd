import { FestivalTask } from "@overbookd/festival-event";
import { DatabaseFestivalActivity } from "./festival-activity.query";

export class FestivalActivityBuilder {
  static fromDatabase(
    activityData: DatabaseFestivalActivity,
  ): FestivalTask["festivalActivity"] {
    return {
      id: activityData.id,
      name: activityData.name,
      status: activityData.status,
      timeWindows: activityData.generalTimeWindows,
      inquiry: {
        timeWindows: activityData.inquiryTimeWindows,
        all: activityData.inquiries.map((inquiry) => ({
          slug: inquiry.slug,
          quantity: inquiry.quantity,
          drive: inquiry.drive,
          name: inquiry.catalogItem.name,
        })),
      },
    };
  }
}
