import {
  gearWithNoInquiry,
  gearWithOneInquiry,
  gearWithTwoInquiries,
  gearWithOneInquiryWithTwoTimeWindows,
  gearWithOneInquiryAndOneInventoryRecord,
  gearWithTwoInquiryAndTwoInventoryRecord,
  friday08hto09h30,
  gearWithNoInquiryForGraph,
  gearWithOneInquiryAndOneInventoryRecordForGraph,
  gearWithTwoInquiryAndTwoInventoryRecordForGraph,
} from "./summary-gear.test-utils";
import { SummaryGear } from "./summary-gear";
import { Period } from "@overbookd/period";

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

describe("Summarize gear for graph", () => {
  describe.each`
    gear                                       | period              | expectedData
    ${gearWithNoInquiry}                       | ${friday08hto09h30} | ${gearWithNoInquiryForGraph}
    ${gearWithOneInquiryAndOneInventoryRecord} | ${friday08hto09h30} | ${gearWithOneInquiryAndOneInventoryRecordForGraph}
    ${gearWithTwoInquiryAndTwoInventoryRecord} | ${friday08hto09h30} | ${gearWithTwoInquiryAndTwoInventoryRecordForGraph}
  `(
    "when gear has $gear.inquiries.length inquiries and $gear.inventoryRecords.length inventory records",
    ({ gear, period, expectedData }) => {
      it(`should return gear for graph with ${expectedData.length} periods`, () => {
        const gearForGraph = SummaryGear.generateForGraph(
          gear,
          Period.init(period),
        );
        expect(gearForGraph).toEqual(expectedData);
      });
    },
  );
});
