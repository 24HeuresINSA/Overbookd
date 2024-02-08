import { FestivalTask } from "@overbookd/festival-event";
import { DatabaseFestivalActivity } from "./festival-activity.query";

export class FestivalActivityBuilder {
  static fromDatabase(
    activityData: DatabaseFestivalActivity,
  ): FestivalTask["festivalActivity"] {
    const doesRequestElectricitySupply = activityData.electricity.length > 0;
    const doesRequestWaterSupply = activityData.water !== null;
    const hasSupplyRequest =
      doesRequestElectricitySupply || doesRequestWaterSupply;
    return {
      id: activityData.id,
      name: activityData.name,
      status: activityData.status,
      location: activityData.location,
      hasSupplyRequest,
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
