import { DatabaseGear } from "./dashboard.model";
import { Period } from "@overbookd/period";
import { sumQuantity } from "./sum-quantity";
import { DashboardGearInquiry } from "./dashboard-gear-inquiry";
import { GearBorrow } from "@overbookd/http";

export class DashboardGearStock {
  private constructor() {}

  static computeGearStock(gear: DatabaseGear, date: Date) {
    const inventory = DashboardGearStock.findInventoryQuantity(gear);
    const borrows: GearBorrow[] = gear.borrows
      .filter(({ borrow }) => {
        const { availableOn: start, unavailableOn: end } = borrow;
        const period = Period.init({ start, end });
        return period.isIncluding(date);
      })
      .map(({ borrow, quantity }) => {
        return { id: borrow.id, lender: borrow.lender, quantity };
      });
    const borrowed = sumQuantity(borrows);
    const stock = inventory + borrowed;
    return { stock, inventory, borrows };
  }

  static computeConsumableStock(gear: DatabaseGear, date: Date) {
    const inventory = DashboardGearStock.findInventoryQuantity(gear);
    const consumed = DashboardGearInquiry.computeConsumedQuantityByDateOn(
      gear,
      date,
    );
    const borrows = DashboardGearStock.findBorrowsGivingConsumableAt(
      gear.borrows,
      date,
    );
    const borrowed = DashboardGearStock.findBorrowedQuantityByDate(gear, date);
    const stock = inventory + borrowed - consumed;
    return { stock, inventory, consumed, borrows };
  }

  private static findBorrowsGivingConsumableAt(
    borrows: DatabaseGear["borrows"],
    date: Date,
  ): GearBorrow[] {
    return borrows.reduce((borrows, { borrow, quantity }) => {
      const isStartingAt = +borrow.availableOn === +date;

      if (!isStartingAt) return borrows;

      const { id, lender } = borrow;
      const borrowDetails = { id, lender, quantity };
      return [...borrows, borrowDetails];
    }, []);
  }

  static findStockByDate(gear: DatabaseGear, date: Date): number {
    const inventory = DashboardGearStock.findInventoryQuantity(gear);
    const borrowed = DashboardGearStock.findBorrowedQuantityByDate(gear, date);
    return inventory + borrowed;
  }

  private static findBorrowedQuantityByDate(
    gear: DatabaseGear,
    date: Date,
  ): number {
    const borrows = gear.borrows.filter(({ borrow }) => {
      const { availableOn: start, unavailableOn: end } = borrow;
      const period = Period.init({ start, end });
      return gear.isConsumable
        ? +borrow.availableOn <= +date
        : period.isIncluding(date);
    });
    return sumQuantity(borrows);
  }

  static findInventoryQuantity(gear: DatabaseGear): number {
    return sumQuantity(gear.inventoryRecords);
  }
}
