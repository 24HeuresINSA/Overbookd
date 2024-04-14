import { Module } from "@nestjs/common";
import { DashboardModule } from "./dashboard/dashboard.module";
import { CatalogModule } from "./catalog/catalog.module";
import { InventoryModule } from "./inventory/inventory.module";
import { BorrowModule } from "./borrow/borrow.module";
import { PurchaseModule } from "./purchase/purchase.module";

@Module({
  imports: [
    DashboardModule,
    CatalogModule,
    InventoryModule,
    BorrowModule,
    PurchaseModule,
  ],
})
export class LogisticModule {}
