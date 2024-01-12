import { CSV, JSON, PreviewForLogistic } from "@overbookd/http";
import { GearReferenceCodeService } from "../../catalog/gear-reference-code.service";

type Formater<T, U> = {
  format(raw: T): U;
};

export class LogisticPreview {
  static withFormat(format: string): Formater<PreviewForLogistic[], unknown> {
    switch (format) {
      case CSV: {
        return { format: (raw) => LogisticPreview.toCsv(raw) };
      }
      case JSON:
      default: {
        return { format: (raw) => raw };
      }
    }
  }

  private static toCsv(previews: PreviewForLogistic[]): string {
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
