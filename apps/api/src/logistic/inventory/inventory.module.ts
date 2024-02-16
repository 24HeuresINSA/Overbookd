import { Module } from "@nestjs/common";
import { PrismaService } from "../../../src/prisma.service";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { PrismaInventoryRepository } from "./repositories/inventory.repository.prisma";

@Module({
  providers: [
    PrismaService,
    InventoryService,
    { provide: "INVENTORY_REPOSITORY", useClass: PrismaInventoryRepository },
  ],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
