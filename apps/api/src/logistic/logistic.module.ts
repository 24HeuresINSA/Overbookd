import { Module } from "@nestjs/common";
import { DashboardModule } from "./dashboard/dashboard.module";
import { CatalogModule } from "./catalog/catalog.module";
import { InventoryModule } from "./inventory/inventory.module";

@Module({
  imports: [DashboardModule, CatalogModule, InventoryModule],
})
export class LogisticModule {}
