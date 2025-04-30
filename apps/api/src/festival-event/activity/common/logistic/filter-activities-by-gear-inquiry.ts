import { ActivityGearSearchOptions } from "@overbookd/http";
import { DatabasePreviewForLogistic } from "../repository/previews.query";
import { SlugifyService } from "@overbookd/slugify";

export class FilterActivitiesByGearInquiry {
  constructor(private readonly activities: DatabasePreviewForLogistic[]) {}

  apply(
    searchOptions: ActivityGearSearchOptions,
  ): DatabasePreviewForLogistic[] {
    const search = SlugifyService.applyOnOptional(searchOptions.search);
    const category = searchOptions.category;
    const owner = searchOptions.owner;
    const drive = searchOptions.drive;

    return this.activities.filter((activity) => {
      const inquiries = activity.inquiries.filter((inquiry) => {
        const inquirySlug = inquiry.catalogItem.slug;
        const inquiryCategory = inquiry.catalogItem.category?.path;
        const inquiryOwner = inquiry.catalogItem.category?.owner?.code;
        const inquiryDrive = inquiry.drive;
        return (
          this.matches(inquirySlug, search) &&
          this.matches(inquiryCategory, category) &&
          this.matches(inquiryOwner, owner) &&
          this.matches(inquiryDrive, drive)
        );
      });
      return inquiries.length > 0;
    });
  }

  private matches(
    value: string | undefined,
    search: string | undefined,
  ): boolean {
    if (!search) return true;
    if (!value) return false;
    return value.includes(search);
  }
}
