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
  consumableGearWithTwoInquiriesAndOneInventoryRecordForGraph,
  consumableGearWithOneInquiry,
  consumableGearWithOneInquiryForGraph,
  consumableGearWithTwoInquiriesAndOneInventoryRecord,
  gearWithTwoInquiriesAndTwoInventoryRecordsForGraph,
  consumableGearWithOneInquiryWithTwoSameActivityTimeWindows,
  consumableGearWithOneInquiryWithTwoSameActivityTimeWindowsForGraph,
  gearWithOneInventoryRecordAndOneBorrow,
  gearWithOneInventoryRecord,
  gearWithOneInquiryAndOneBorrow,
  consumableGearWithOneInquiryAndOneBorrow,
  gearWithOneInventoryRecordAndOneBorrowForGraph,
  consumableGearWithOneInquiryAndOneBorrowForGraph,
} from "./dashboard-gear.test-utils";
import { DashboardGear } from "./dashboard-gear";
import { Period } from "@overbookd/period";

describe("Summarize gear as preview", () => {
  describe.each`
    explaination                                                          | gear                                                          | expectedStockDiscrepancy
    ${"has no entries"}                                                   | ${gearWithNoInquiry}                                          | ${0}
    ${"has one inquiry only"}                                             | ${gearWithOneInquiry}                                         | ${-10}
    ${"has two inquiries only"}                                           | ${gearWithTwoInquiries}                                       | ${-25}
    ${"has one inquiry with two time windows"}                            | ${gearWithOneInquiryWithTwoTimeWindows}                       | ${-30}
    ${"has one inquiry with one inventory record"}                        | ${gearWithOneInquiryAndOneInventoryRecord}                    | ${15}
    ${"has two inquiries with two inventory records"}                     | ${gearWithTwoInquiryAndTwoInventoryRecord}                    | ${-25}
    ${"is consumable and has one inquiry"}                                | ${consumableGearWithOneInquiry}                               | ${-10}
    ${"is consumable and has one inquiry with two activity time windows"} | ${consumableGearWithOneInquiryWithTwoSameActivityTimeWindows} | ${-60}
    ${"is consumable and has two inquiries and one inventory records"}    | ${consumableGearWithTwoInquiriesAndOneInventoryRecord}        | ${-40}
    ${"has one inventory record"}                                         | ${gearWithOneInventoryRecord}                                 | ${25}
    ${"has one inventory record and one borrow"}                          | ${gearWithOneInventoryRecordAndOneBorrow}                     | ${25}
    ${"has one inquiry and one borrow"}                                   | ${gearWithOneInquiryAndOneBorrow}                             | ${-5}
    ${"is consumable and has one inquiry and one borrow"}                 | ${consumableGearWithOneInquiryAndOneBorrow}                   | ${-15}
  `("when gear $explaination", ({ gear, expectedStockDiscrepancy }) => {
    it(`should return preview with ${expectedStockDiscrepancy} as stock discrepancy`, () => {
      const preview = DashboardGear.generatePreview(gear);
      const expectedPreview = {
        id: gear.id,
        name: gear.name,
        slug: gear.slug,
        isConsumable: gear.isConsumable,
        stockDiscrepancy: expectedStockDiscrepancy,
      };
      expect(preview).toEqual(expectedPreview);
    });
  });
});

describe("Summarize gear for graph", () => {
  describe.each`
    explaination                                                          | gear                                                          | period              | expectedData
    ${"has no entries"}                                                   | ${gearWithNoInquiry}                                          | ${friday08hto09h30} | ${gearWithNoInquiryForGraph}
    ${"has one inquiry and one inventory record"}                         | ${gearWithOneInquiryAndOneInventoryRecord}                    | ${friday08hto09h30} | ${gearWithOneInquiryAndOneInventoryRecordForGraph}
    ${"has two inquiries and two inventory records"}                      | ${gearWithTwoInquiryAndTwoInventoryRecord}                    | ${friday08hto09h30} | ${gearWithTwoInquiriesAndTwoInventoryRecordsForGraph}
    ${"is consumable and has one inquiry"}                                | ${consumableGearWithOneInquiry}                               | ${friday08hto09h30} | ${consumableGearWithOneInquiryForGraph}
    ${"is consumable and has one inquiry with two activity time windows"} | ${consumableGearWithOneInquiryWithTwoSameActivityTimeWindows} | ${friday08hto09h30} | ${consumableGearWithOneInquiryWithTwoSameActivityTimeWindowsForGraph}
    ${"is consumable and has two inquiries and one inventory record"}     | ${consumableGearWithTwoInquiriesAndOneInventoryRecord}        | ${friday08hto09h30} | ${consumableGearWithTwoInquiriesAndOneInventoryRecordForGraph}
    ${"has one inventory record and one borrow"}                          | ${gearWithOneInventoryRecordAndOneBorrow}                     | ${friday08hto09h30} | ${gearWithOneInventoryRecordAndOneBorrowForGraph}
    ${"is consumable and has one inquiry and one borrow"}                 | ${consumableGearWithOneInquiryAndOneBorrow}                   | ${friday08hto09h30} | ${consumableGearWithOneInquiryAndOneBorrowForGraph}
  `("when gear $explaination", ({ gear, period, expectedData }) => {
    it(`should return gear for graph with ${expectedData.length} periods`, () => {
      const gearForGraph = DashboardGear.generateDetails(
        gear,
        Period.init(period),
      );
      expect(gearForGraph).toEqual(expectedData);
    });
  });
});
