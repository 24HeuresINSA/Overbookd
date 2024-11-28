import { DatabaseDashboardGear } from "./dashboard.model";
import { Period } from "@overbookd/time";
import { sumQuantity } from "./sum-quantity";
import { DashboardGearInquiry } from "./dashboard-gear-inquiry";
import { GearBorrow, GearPurchase } from "@overbookd/http";

export class DashboardGearStock {
  private constructor() {}

  static computeGearStock(gear: DatabaseDashboardGear, date: Date) {
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

    const purchases = DashboardGearStock.findPurchasesAt(gear.purchases, date);
    const purchased = DashboardGearStock.findPurchaseQuantityByDate(gear, date);

    const stock = inventory + borrowed + purchased;
    return { stock, inventory, borrows, purchases };
  }

  static computeConsumableStock(gear: DatabaseDashboardGear, date: Date) {
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

    const purchases = DashboardGearStock.findPurchasesAt(gear.purchases, date);
    const purchased = DashboardGearStock.findPurchaseQuantityByDate(gear, date);

    const stock = inventory + borrowed + purchased - consumed;
    return { stock, inventory, consumed, borrows, purchases };
  }

  private static findBorrowsGivingConsumableAt(
    borrows: DatabaseDashboardGear["borrows"],
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

  private static findPurchasesAt(
    purchases: DatabaseDashboardGear["purchases"],
    date: Date,
  ): GearPurchase[] {
    return purchases.reduce((purchases, { purchase, quantity }) => {
      const isStartingAt = +purchase.availableOn === +date;

      if (!isStartingAt) return purchases;

      const { id, seller } = purchase;
      const purchaseDetails = { id, seller, quantity };
      return [...purchases, purchaseDetails];
    }, []);
  }

  static findStockByDate(gear: DatabaseDashboardGear, date: Date): number {
    const inventory = DashboardGearStock.findInventoryQuantity(gear);
    const borrowed = DashboardGearStock.findBorrowedQuantityByDate(gear, date);
    const purchased = DashboardGearStock.findPurchaseQuantityByDate(gear, date);
    return inventory + borrowed + purchased;
  }

  private static findBorrowedQuantityByDate(
    gear: DatabaseDashboardGear,
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

  private static findPurchaseQuantityByDate(
    gear: DatabaseDashboardGear,
    date: Date,
  ): number {
    const purchases = gear.purchases.filter(({ purchase }) => {
      return +purchase.availableOn <= +date;
    });
    return sumQuantity(purchases);
  }

  static findInventoryQuantity(gear: DatabaseDashboardGear): number {
    return sumQuantity(gear.inventoryRecords);
  }
}
