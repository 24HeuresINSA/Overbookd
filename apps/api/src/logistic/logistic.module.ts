import { Module } from "@nestjs/common";
import { DashboardModule } from "./dashboard/dashboard.module";
import { CatalogModule } from "./catalog/catalog.module";
import { InventoryModule } from "./inventory/inventory.module";
import { BorrowModule } from "./borrow/borrow.module";

@Module({
  imports: [DashboardModule, CatalogModule, InventoryModule, BorrowModule],
})
export class LogisticModule {}
