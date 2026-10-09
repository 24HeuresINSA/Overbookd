import { Module } from "@nestjs/common";
import { InventoryManager } from "@overbookd/logistic";
import { PrismaService } from "../../../src/prisma.service";
import { InventoryController } from "./inventory.controller";
import { InventoryService } from "./inventory.service";
import { PrismaInventoryRepository } from "./repositories/inventory.repository.prisma";

@Module({
  providers: [
    PrismaService,
    PrismaInventoryRepository,
    {
      provide: InventoryManager,
      useFactory: (records: PrismaInventoryRepository) =>
        new InventoryManager(records),
      inject: [PrismaInventoryRepository],
    },
    {
      provide: InventoryService,
      useFactory: (inventory: InventoryManager) =>
        new InventoryService(inventory),
      inject: [InventoryManager],
    },
  ],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
