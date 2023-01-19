import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InMemoryInventoryRepository } from './repositories/inventory.repository.inmemory';

@Module({
  imports: [CommonModule],
  providers: [
    InventoryService,
    { provide: 'INVENTORY_REPOSITORY', useClass: InMemoryInventoryRepository },
  ],
  controllers: [InventoryController],
  exports: [InventoryService],
})
export class InventoryModule {}
