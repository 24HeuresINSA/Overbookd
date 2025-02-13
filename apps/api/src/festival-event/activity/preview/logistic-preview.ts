import { LogisticInquiry } from "@overbookd/http";
import { GearReferenceCodeService } from "../../../logistic/catalog/gear-reference-code.service";
import { FestivalActivity } from "@overbookd/festival-event";

export type PreviewForLogistic = {
  id: FestivalActivity["id"];
  name: FestivalActivity["general"]["name"];
  status: FestivalActivity["status"];
  timeWindows: FestivalActivity["inquiry"]["timeWindows"];
  inquiries: LogisticInquiry[];
};

export class LogisticPreview {
  static toCsv(previews: PreviewForLogistic[]): string {
    const csvHeader = [
      "seeker.type",
      "seeker.id",
      "seeker.name",
      "rentalPeriod.start",
      "rentalPeriod.end",
      "rentalPeriod.id",
      "quantity",
      "status",
      "drive",
      "gear.name",
      "gear.slug",
      "gear.id",
      "gear.isPonctualUsage",
      "gear.isConsumable",
      "gear.category.name",
      "gear.category.path",
      "gear.category.id",
      "gear.owner.name",
      "gear.owner.code",
      "gear.code",
    ].join(";");

    const csvContent = previews.flatMap((preview) => {
      return preview.timeWindows.flatMap((timeWindow) => {
        return preview.inquiries.map((inquiry) => {
          const gear = inquiry.gear;
          const category = gear.category;
          const owner = category.owner;
          return [
            "FA",
            preview.id,
            preview.name,
            timeWindow.start,
            timeWindow.end,
            timeWindow.id,
            inquiry.quantity,
            preview.status,
            inquiry.drive,
            inquiry.name,
            inquiry.slug,
            gear.id,
            gear.isPonctualUsage,
            gear.isConsumable,
            category.name,
            category.path,
            category.id,
            owner.name,
            owner.code,
            GearReferenceCodeService.computeGearCode(category, gear.id),
          ].join(";");
        });
      });
    });

    const csv = [csvHeader, ...csvContent].join("\n");
    const regex = new RegExp(/undefined/i, "g");

    return csv.replace(regex, "");
  }
}
