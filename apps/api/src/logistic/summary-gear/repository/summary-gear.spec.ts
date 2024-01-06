import {
  gearWithNoInquiry,
  gearWithOneInquiry,
  gearWithTwoInquiries,
  gearWithOneInquiryWithTwoTimeWindows,
  gearWithOneInquiryAndOneInventoryRecord,
  gearWithTwoInquiryAndTwoInventoryRecord,
  friday08hto09h30,
} from "./summary-gear.test-utils";
import { SummaryGear } from "./summary-gear";
import { gearWithOneInquiryAndOneInventoryRecordDetails } from "./summary-gear.test-utils";

describe("Summarize gear as preview", () => {
  describe.each`
    gear                                       | expectedStockDiscrepancy
    ${gearWithNoInquiry}                       | ${0}
    ${gearWithOneInquiry}                      | ${-10}
    ${gearWithTwoInquiries}                    | ${-20}
    ${gearWithOneInquiryWithTwoTimeWindows}    | ${-30}
    ${gearWithOneInquiryAndOneInventoryRecord} | ${15}
    ${gearWithTwoInquiryAndTwoInventoryRecord} | ${-10}
  `(
    "when gear has $gear.inquiries.length inquiries and $gear.inventoryRecords.length inventory records",
    ({ gear, expectedStockDiscrepancy }) => {
      it(`should return preview with ${expectedStockDiscrepancy} as stock discrepancy`, () => {
        const preview = SummaryGear.generatePreview(gear);
        const expectedPreview = {
          id: gear.id,
          name: gear.name,
          slug: gear.slug,
          isConsumable: gear.isConsumable,
          stockDiscrepancy: expectedStockDiscrepancy,
        };
        expect(preview).toEqual(expectedPreview);
      });
    },
  );
});

describe("Summarize gear as details", () => {
  describe.each`
    gear                                       | period              | expectedDetails
    ${gearWithOneInquiryAndOneInventoryRecord} | ${friday08hto09h30} | ${gearWithOneInquiryAndOneInventoryRecordDetails}
  `(
    "when gear has $gear.inquiries.length inquiries and $gear.inventoryRecords.length inventory records",
    ({ gear, period, expectedDetails }) => {
      it(`should return details with ${expectedDetails.length} items`, () => {
        const details = SummaryGear.generateDetails(gear, period);
        expect(details).toEqual(expectedDetails);
      });
    },
  );
});
