import {
  gearWithNoInquiry,
  gearWithOneInquiry,
  gearWithTwoInquiries,
  gearWithOneInquiryWithTwoTimeWindows,
  gearWithOneInquiryAndOneInventoryRecord,
  gearWithTwoInquiriesAndTwoInventoryRecords,
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
  gearWithOneInventoryRecordAndOnePurchase,
  gearWithOneInquiryAndOnePurchase,
  consumableGearWithOneInquiryAndOnePurchase,
  gearWithOneInventoryRecordAndOnePurchaseForGraph,
  consumableGearWithOneInquiryAndOnePurchaseForGraph,
  gearWithOneInquiryAndOnePurchaseForCsv,
  gearWithTwoInquiriesAndTwoInventoryRecordsForCsv,
  gearWithOneInquiryAndOneBorrowForCsv,
} from "./dashboard-gear.test-utils";
import { DashboardGear } from "./dashboard-gear";
import { Period } from "@overbookd/time";

describe("Summarize gear as preview", () => {
  describe.each`
    explaination                                                          | gear                                                          | expectedStockDiscrepancy
    ${"has no entries"}                                                   | ${gearWithNoInquiry}                                          | ${0}
    ${"has one inquiry only"}                                             | ${gearWithOneInquiry}                                         | ${-10}
    ${"has two inquiries only"}                                           | ${gearWithTwoInquiries}                                       | ${-25}
    ${"has one inquiry with two time windows"}                            | ${gearWithOneInquiryWithTwoTimeWindows}                       | ${-30}
    ${"has one inquiry with one inventory record"}                        | ${gearWithOneInquiryAndOneInventoryRecord}                    | ${15}
    ${"has two inquiries with two inventory records"}                     | ${gearWithTwoInquiriesAndTwoInventoryRecords}                 | ${-25}
    ${"is consumable and has one inquiry"}                                | ${consumableGearWithOneInquiry}                               | ${-10}
    ${"is consumable and has one inquiry with two activity time windows"} | ${consumableGearWithOneInquiryWithTwoSameActivityTimeWindows} | ${-60}
    ${"is consumable and has two inquiries and one inventory records"}    | ${consumableGearWithTwoInquiriesAndOneInventoryRecord}        | ${-40}
    ${"has one inventory record"}                                         | ${gearWithOneInventoryRecord}                                 | ${25}
    ${"has one inventory record and one borrow"}                          | ${gearWithOneInventoryRecordAndOneBorrow}                     | ${25}
    ${"has one inquiry and one borrow"}                                   | ${gearWithOneInquiryAndOneBorrow}                             | ${-5}
    ${"is consumable and has one inquiry and one borrow"}                 | ${consumableGearWithOneInquiryAndOneBorrow}                   | ${-15}
    ${"has one inventory record and one purchase"}                        | ${gearWithOneInventoryRecordAndOnePurchase}                   | ${25}
    ${"has one inquiry and one purchase"}                                 | ${gearWithOneInquiryAndOnePurchase}                           | ${-5}
    ${"is consumable and has one inquiry and one purchase"}               | ${consumableGearWithOneInquiryAndOnePurchase}                 | ${-15}
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
    ${"has two inquiries and two inventory records"}                      | ${gearWithTwoInquiriesAndTwoInventoryRecords}                 | ${friday08hto09h30} | ${gearWithTwoInquiriesAndTwoInventoryRecordsForGraph}
    ${"is consumable and has one inquiry"}                                | ${consumableGearWithOneInquiry}                               | ${friday08hto09h30} | ${consumableGearWithOneInquiryForGraph}
    ${"is consumable and has one inquiry with two activity time windows"} | ${consumableGearWithOneInquiryWithTwoSameActivityTimeWindows} | ${friday08hto09h30} | ${consumableGearWithOneInquiryWithTwoSameActivityTimeWindowsForGraph}
    ${"is consumable and has two inquiries and one inventory record"}     | ${consumableGearWithTwoInquiriesAndOneInventoryRecord}        | ${friday08hto09h30} | ${consumableGearWithTwoInquiriesAndOneInventoryRecordForGraph}
    ${"has one inventory record and one borrow"}                          | ${gearWithOneInventoryRecordAndOneBorrow}                     | ${friday08hto09h30} | ${gearWithOneInventoryRecordAndOneBorrowForGraph}
    ${"is consumable and has one inquiry and one borrow"}                 | ${consumableGearWithOneInquiryAndOneBorrow}                   | ${friday08hto09h30} | ${consumableGearWithOneInquiryAndOneBorrowForGraph}
    ${"has one inventory record and one purchase"}                        | ${gearWithOneInventoryRecordAndOnePurchase}                   | ${friday08hto09h30} | ${gearWithOneInventoryRecordAndOnePurchaseForGraph}
    ${"is consumable and has one inquiry and one purchase"}               | ${consumableGearWithOneInquiryAndOnePurchase}                 | ${friday08hto09h30} | ${consumableGearWithOneInquiryAndOnePurchaseForGraph}
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

describe("Summarize gear as requirement for CSV", () => {
  describe.each`
    explaination                                      | gear                                          | expected
    ${"has two inquiries with two inventory records"} | ${gearWithTwoInquiriesAndTwoInventoryRecords} | ${gearWithTwoInquiriesAndTwoInventoryRecordsForCsv}
    ${"has one inquiry and one purchase"}             | ${gearWithOneInquiryAndOnePurchase}           | ${gearWithOneInquiryAndOnePurchaseForCsv}
    ${"has one inquiry and one borrow"}               | ${gearWithOneInquiryAndOneBorrow}             | ${gearWithOneInquiryAndOneBorrowForCsv}
  `("when gear $explaination", ({ gear, expected }) => {
    it(`should return requirement for CSV`, () => {
      const requirement = DashboardGear.generateRequirementForCsv(gear);
      expect(requirement).toEqual(expected);
    });
  });
  describe("when gear is consumable", () => {
    it("should return null", () => {
      const consumableGear = consumableGearWithOneInquiryAndOnePurchase;
      const requirement =
        DashboardGear.generateRequirementForCsv(consumableGear);
      expect(requirement).toBeNull();
    });
  });
  describe.each`
    explaination                                   | gear
    ${"has no entries"}                            | ${gearWithNoInquiry}
    ${"has one inventory record and one borrow"}   | ${gearWithOneInventoryRecordAndOneBorrow}
    ${"has one inventory record and one purchase"} | ${gearWithOneInventoryRecordAndOnePurchase}
  `("when gear without stock discrepancy $explaination", ({ gear }) => {
    it("should return null", () => {
      const requirement = DashboardGear.generateRequirementForCsv(gear);
      expect(requirement).toBeNull();
    });
  });
});
